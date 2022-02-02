#!/usr/bin/bash
export NODE_ENV=test

# need to build before running serve, but everything else can be run in parallel
pnpx npm-run-all --parallel --print-label \
  vitest-run \
  build \
  lint \
  typecheck \
  &&

pnpx npm-run-all --parallel --print-label --race serve cypress-run
