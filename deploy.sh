#!/usr/bin/env sh

# abort on errors
set -e

if [ -d "dist" ]
then
    rm -rf dist
fi

# build
yarn run build

if [ -d "docs" ]
then
    rm -rf docs
fi

# navigate into the build output directory
mv dist docs

git add .
git commit -m 'deploy'
git push