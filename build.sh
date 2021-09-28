#!/usr/bin/env bash

REPOSITORY=registry.cn-hangzhou.aliyuncs.com/repo/project
CI_BUILD_TAG=${1:-latest}
ENV=${2:-production}
CONTAINER=project

yarn
NODE_ENV=production yarn build
npx --quiet pinst --disable
docker buildx build --no-cache --platform linux/amd64 --push -t ${REPOSITORY}:${CI_BUILD_TAG} .
npx --quiet pinst --enable
git tag ${CI_BUILD_TAG}
git push origin --tags
