import boto3
import json
import sys

# If you have credentials saved in ~/.aws/config using IAM (`aws sso login`) then use these lines:
# session = boto3.Session(profile_name="SSO_PROFILE_NAME")
# bedrock = boto3.client(
#     "bedrock",
#     "us-west-2",
#     endpoint_url="https://bedrock.us-east-1.amazonaws.com"
# )
# bedrock.list_foundation_models()

# I can't get this working for some reason,
# so alternatively, provide temporary credentials manually.
temp_aws_access_key_id="eXaMpLe"
temp_aws_secret_access_key="1A2b3C"
temp_aws_session_token="AbCdEfG"

bedrock = boto3.client(
    "bedrock",
    "us-west-2",
    endpoint_url="https://bedrock.us-west-2.amazonaws.com",
    aws_access_key_id=temp_aws_access_key_id,
    aws_secret_access_key=temp_aws_secret_access_key,
    aws_session_token=temp_aws_session_token,
)

body = json.dumps({"inputText": sys.stdin.read()})
modelId = "amazon.titan-tg1-large"
accept = "application/json"
contentType = "application/json"
response = bedrock.invoke_model(body=body, modelId=modelId, accept=accept,
contentType=contentType)
response_body = json.loads(response.get("body").read())
# text
print(response_body.get("results")[0].get("outputText"))
