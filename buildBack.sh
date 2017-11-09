#!/usr/bin/env bash

set -e

BRANCH=master

if [[ $NODE_ENV != "production" ]];
then
    BRANCH=dev
fi

if [ ! -d backend ]; then
    (git clone https://github.com/VTbiocomplexity/backend backend)
fi

(
    cd backend || exit;
    git stash;
    git checkout $BRANCH;
    git pull;
    yarn install;
    mkdir -p frontend/dist
)
