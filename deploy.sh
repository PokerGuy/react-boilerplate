#!/bin/bash

echo "Hello, world!"

echo "Downloading npm modules - cheating using npm install"

mkdir node_modules

cd node_modules

echo $(pwd)

aws s3 sync s3://sandbox-npm-modules/react-boilerplate/ ./

cd ..

echo $(pwd)

echo "Got all the modules... running npm build"

npm run build

cd build

echo $(pwd)

ls
