#!/bin/bash
TF_DIR=./infrastructure/
BUILD_DIR=./dist

# get function bucket name (because it's suffixed with a random ID)
printf "\nGetting TF outputs...\n"
DASHBOARD_BUCKET=$(terraform -chdir=$TF_DIR output -raw dashboard_bucket)
DASHBOARD_DISTRIBUTION=$(terraform -chdir=$TF_DIR output -raw dashboard_distribution)

# assume the same role that terraform uses
printf "\nAssuming STS session...\n"
AWSSESSION=$(aws sts assume-role --role-arn $(terraform -chdir=$TF_DIR output -raw aws_assume_role) --role-session-name "Makefile-Upload-Dashboard")
export AWS_ACCESS_KEY_ID=$(echo $AWSSESSION | jq -r '.Credentials''.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $AWSSESSION | jq -r '.Credentials''.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $AWSSESSION | jq -r '.Credentials''.SessionToken')
if [ -z $AWS_DEFAULT_REGION ]; then
  export AWS_DEFAULT_REGION="us-east-1"
fi

printf "\nUploading files...\n\n"
aws s3 cp $BUILD_DIR s3://$DASHBOARD_BUCKET/ --recursive

printf "\nCreating CloudFront invalidation...\n"
aws cloudfront create-invalidation --distribution-id $DASHBOARD_DISTRIBUTION --paths "/index.html" &> /dev/null

printf "\nDone!"