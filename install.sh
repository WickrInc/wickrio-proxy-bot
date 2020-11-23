#!/bin/sh
npm install --unsafe-perm

if [ -d "/src" ] 
then
    npm run build
fi