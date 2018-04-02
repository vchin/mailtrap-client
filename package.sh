#!/bin/bash
rm dist/* -f
tsc --sourceMap false
cp package.json dist/package.json
cp package-lock.json dist/package-lock.json
cp LICENSE dist/LICENSE
cp README.md dist/README.md
