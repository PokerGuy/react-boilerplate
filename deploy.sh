#!/bin/bash
AWS_ENV=$1

echo "Environment is ${AWS_ENV}"

cd /tmp/clone/.github

#npm install

#echo "now doing npm run build"

#npm run build

#cd build

#echo "Into the build directory"
#currdir=$(pwd)
#echo $currdir

#contents=$(ls)
#echo "contents of the build directory"
#echo $contents
echo "Doing a sync to the bucket"
aws s3 sync . s3://${AWS_ENV}.build.magickpics.com

echo "Done!"
