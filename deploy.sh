#!/bin/bash

echo "Hello, world!"

echo "Downloading npm modules - cheating using npm install"

mkdir node_modules

cd node_modules

currdir=$(pwd)

echo $currdir

aws s3 sync s3://sandbox-npm-modules/react-boilerplate/ ./

cd ..

currdir=$(pwd)
echo $currdir

echo "Got all the modules... running npm build"

npm run build

cd build

currdir=$(pwd)
echo $currdir

ls
