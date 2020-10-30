#!/bin/sh

if [ $# -ne 1 ]
  then
    echo "Usage: generate.sh <destination path>"
    exit 1
fi

mkdir -p temp

cp -r configure.js configure.sh install.sh package.json processes.json README.md restart.sh src start.sh stop.sh upgrade.js upgrade.sh temp configTokens.json

cd temp
tar czf $1/software.tar.gz *
cd ..
rm -r temp
