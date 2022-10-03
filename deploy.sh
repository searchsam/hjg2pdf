#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn run build

# navigate into the build output directory
cd dist

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:searchsam/hjg2pdf.git master:gh-pages

cd -