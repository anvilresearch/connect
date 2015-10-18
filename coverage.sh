#!/bin/bash

set -e

NODE_ENV=test ./node_modules/.bin/istanbul cover node_modules/.bin/_mocha --dir ./coverage/integration -- --timeout 0  --compilers coffee:coffee-script/register test/integration/
NODE_ENV=test ./node_modules/.bin/istanbul cover node_modules/.bin/_mocha --dir ./coverage/unit -- --timeout 0  --compilers coffee:coffee-script/register test/unit/
./node_modules/.bin/istanbul report  --root coverage/ --dir coverage/
