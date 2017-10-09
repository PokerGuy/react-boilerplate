#!/bin/bash
AWS_ENV=$1

echo "Environment is ${AWS_ENV}"

cd /tmp/clone/.github

npm install

npm run build

cd build

echo "Doing a sync to the bucket"
aws s3 sync . s3://${AWS_ENV}.build.magickpics.com

echo "Done!"
