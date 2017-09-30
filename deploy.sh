#!/bin/bash

echo "Hello, world!"

cd /tmp/clone

npm install

echo "now doing npm run build"

npm run build

cd build

echo "Into the build directory"
currdir=$(pwd)
echo $currdir

contents=$(ls)
echo "contents of the build directory"
echo $contents

cd ..

aws s3 sync . s3://sandbox.build.magickpics.com

echo "Done!"
