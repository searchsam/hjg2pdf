#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PAGE_DIR="/docs"
ASSET_DIR="/dist"

(
  cd $DIR;
  if [ -d "${DIR}${PAGE_DIR}" ]
  then
    rm -r "${DIR}${PAGE_DIR}"
  fi

  cp -r "${DIR}${ASSET_DIR}" "${DIR}${PAGE_DIR}"
  chown mageia:mageia "${DIR}${PAGE_DIR}"
  chmod -R 775 "${DIR}${PAGE_DIR}"
)
