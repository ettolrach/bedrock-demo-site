# Bedrock Demonstration

A demo website to show how to call Amazon Bedrock.

## Amazon Bedrock User Guide

A lot of this was written with reference to the Amazon Bedrock User Guide.
This can be found in the AWS console after selecting Bedrock, then the Amazon Titan provider.
Scroll down, there you will find a link to the "Amazon Bedrock Documentation".
The link should look something like this:
`https://468rtv7h6v8.cloudfront.net/Documentation/BedrockUserGuide.pdf`.

Alternatively, a (possibly outdated) version of the user guide is available on the
[Internet Archive](https://web.archive.org/web/20230805200431/https://preview.documentation.bedrock.aws.dev/Documentation/BedrockUserGuide.pdf).

## How to run

Install these prerequisites:

1. Download the Python SDK from the Amazon Bedrock User Guide mentioned above
(should be on page 22, number 2).

2. Extract the `whl` files into this directory.

3. To not pollute the system, create a new Python virtual environment.
In the code, this is called `bedrock-venv`,
but you can choose a different name and perform a find/replace.

4. Install the `whl` files using pip (`python -m pip install`) to the virtual environment.
**If you already have the AWS CLI installed, then don't install the awscli `whl` file.**

    - **Important to note if you wish to install the awscli `whl`**:
    Currently, there exists an issue with Cython 3 and PyYAML >5.4,
    [specifically this GitHub issue](https://github.com/yaml/pyyaml/issues/601).

    - As a workaround, before installing awscli, run the following commands:

        ```sh
        python -m pip install "cython<3.0.0" wheel
        python -m pip install pyyaml==5.4.1 --no-build-isolation
        # The specific version of awscli might have changed by the time you read this.
        python -m pip install awscli-1.27.162-py3-none-any.whl
        ```

        Replace `python -m pip` with however you call pip on your machine
        (for example, just `pip`, `python3 -m pip`, etc.).

        Source:
        [above issue, comment from RamakrishnaHande](https://github.com/yaml/pyyaml/issues/601#issuecomment-1660456820).

Then, run server with `node server.js`.

## How to use

By default, the server uses port 8080, so visit [http://localhost:8080](http://localhost:8080).
Right now, follow-up prompts don't work.

## Licence

Copyright 2023 Charlotte Ausel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
