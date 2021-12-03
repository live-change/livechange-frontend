#!/bin/bash

if [[ -z "${VERSION_NAME}" ]]; then
  VERSION_NAME=`echo "console.log(new Date().toISOString())" | node`
fi
DEST_DIR=../shoutbox-6-recording/$VERSION_NAME
echo Saving version $VERSION_NAME TO $DEST_DIR
mkdir -p $DEST_DIR

( git status --short| grep '^?' | cut -d\  -f2- && git ls-files ) | sort -u \
 | ( xargs -d '\n' -- stat -c%n 2>/dev/null  ||: ) \
 | cpio -pvd $DEST_DIR

pushd $DEST_DIR
  pushd e2e
    env RECORD_TESTS=true npx codeceptjs run
  popd
popd
