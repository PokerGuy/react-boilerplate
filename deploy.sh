#!/bin/bash

echo "Hello, world!"

echo "Downloading npm modules - cheating using npm install"

mkdir node_modules

cd node_modules

echo "changing into the node_modules directory..."
currdir=$(pwd)
echo $currdir

aws s3 sync s3://sandbox-npm-modules/react-boilerplate/ ./

cd ..

echo "Back to the /tmp/clone directory..."
currdir=$(pwd)
echo $currdir

echo "Got all the modules... running npm build:dll"

npm run build:dll

echo "Now doing npm run build"

npm run build

cd build

echo "Into the build directory"
currdir=$(pwd)
echo $currdir

contents=$(ls)
echo "contents of the build directory"
echo $contents
