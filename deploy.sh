#!/usr/bin/env sh

# abort on errors
set -e

rm -rf dist

# build
yarn run build

rm -rf docs

# navigate into the build output directory
mv dist docs

git add .
git commit -m 'deploy'
git push