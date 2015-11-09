#!/bin/bash
# This script was used by package.json during `npm run coverage`
#
# Initially this was done to have our unit tests and integration
# tests run seperately while still combining their coverage data.
#
# One reason to was that the tests were failing when run together.
# Now something has changed and this is no longer the case.
#
# Since we want to be able to run all tests at once it makes
# sense to do this during the build so regressions will fail the
# build.
#
# This script remains useful during development.

set -e

NODE_ENV=test ./node_modules/.bin/istanbul cover node_modules/.bin/_mocha --dir ./coverage/integration -- --timeout 0  --compilers coffee:coffee-script/register test/integration/
NODE_ENV=test ./node_modules/.bin/istanbul cover node_modules/.bin/_mocha --dir ./coverage/unit -- --timeout 0  --compilers coffee:coffee-script/register test/unit/
./node_modules/.bin/istanbul report  --root coverage/ --dir coverage/
