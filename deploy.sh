#!/bin/bash

echo "Hello, world!"

echo "Downloading npm modules - cheating using npm install"

mkdir node_modules

cd node_modules

echo "changing into the node_modules directory..."
currdir=$(pwd)
echo $currdir

sync=$(aws s3 sync s3://sandbox-npm-modules/react-boilerplate .)
echo "Results of the sync command..."
echo $sync

echo "The contents of node_modules is..."
contents=$(ls)
echo $contents

cd ..

echo "Back to the /tmp/clone directory..."
currdir=$(pwd)
echo $currdir

echo "Got all the modules... running npm install"

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
