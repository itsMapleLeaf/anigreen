#!/usr/bin/bash
export NODE_ENV=test

pnpx npm-run-all --parallel --race --print-label \
  vitest-watch \
  remix-watch \
  graphql-watch \
  serve \
  cypress-open
