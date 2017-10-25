#!/bin/bash
AWS_ENV=$1

echo "Environment is ${AWS_ENV}"

if [ "$AWS_ENV" = "prod" ]; then
  export API_URL="https://api.magickpics.com"
elif [ "$AWS_ENV" = "test" ]; then
  export API_URL="https://test.api.magickpics.com"
else
  export API_URL="https://sandbox.api.magickpics.com"
fi

echo "Setting API_URL to ${API_URL}"

cd /tmp/clone

npm install

npm run build

if [[ $? -ne 0 ]]; then
  exit 1
else
  cd build
  aws s3 rm s3://${AWS_ENV}.build.magickpics.com --recursive
  echo "Doing a sync to the bucket"
  aws s3 sync . s3://${AWS_ENV}.build.magickpics.com
  echo "Done!"
fi
