#!/bin/bash
AWS_ENV=$1

echo "Environment is ${AWS_ENV}"

cd /tmp/clone

npm install

npm run build

if [[ $? ne 0 ]]; then
  exit 1
else
  cd build
  aws s3 rm s3://${AWS_ENV}.build.magickpics.com --recursive
  echo "Doing a sync to the bucket"
  aws s3 sync . s3://${AWS_ENV}.build.magickpics.com
  echo "Done!"
fi
