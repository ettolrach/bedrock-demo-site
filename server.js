import * as http from "node:http";
import { promisify } from "node:util";
import { exec as exec_callback } from "node:child_process";
const exec = promisify(exec_callback);
import * as fs from "node:fs";
import * as path from "node:path";

const PORT = 8080;
const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
};

// This is for serving static files. Adapted from MDN:
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
const STATIC_PATH = path.join(process.cwd(), "./");
const toBool = [() => true, () => false];
const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];
    if (url.endsWith("/")) paths.push("index.html");
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : STATIC_PATH + "/404.html";
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

async function call_bedrock(prompt) {
    // Replace bedrock-venv with whatever you called the virtual environment.
    const { stdout, stderr } = await exec(`echo "${prompt}" | bedrock-venv/bin/python bedrock.py`);
    return stdout;
}

http.createServer(async (request, response) => {
    // If the request was POST to /bedrock then call bedrock.py with the provided prompt.
    if (request.method === "POST" && request.url === "/bedrock") {
        const { headers, method, url } = request;
        // Receive the request body in chunks.
        let body = [];
        request.on("error", (err) => {
            console.error(err);
        }).on("data", (chunk) => {
            body.push(chunk);
        }).on("end", async () => {
            body = Buffer.concat(body).toString("utf-8");
    
            response.on("error", (err) => {
                console.log(err);
                console.error(err);
            });

            let bedrock_text = await call_bedrock(body);
    
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/plain");
            const responseBody = { headers, method, url, "body": bedrock_text };
            response.write(JSON.stringify(responseBody));
            response.end();
        });
    }
    // Otherwise, serve whichever static file which was requested (and 404 if it doesn't exist).
    else {
        const file = await prepareFile(request.url);
        const statusCode = file.found ? 200 : 404;
        const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
        response.writeHead(statusCode, { "Content-Type": mimeType });
        file.stream.pipe(response);
    }
}).listen(PORT, () => {
    console.log(`Now listening on port ${PORT}.`)
});
