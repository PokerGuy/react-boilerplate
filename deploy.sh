#!/bin/bash

echo "Hello, world!"

mkdir node_modules

npm install

npm run build

cd build

ls
