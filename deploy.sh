#!/bin/bash

echo "Hello, world!"

cd /tmp/clone

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
