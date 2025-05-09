# vim: syn=dockerfile
FROM node:22.14.0-alpine3.20 as builder
LABEL stage=psydb-prebuild

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/deploy
RUN mkdir -p /usr/src/app/config # mount point for user config
WORKDIR /usr/src/app

# FIXME: maybe not rquired with rush deploy
COPY rush.json /usr/src/app/

COPY common common
COPY packages packages
COPY tools-extra tools-extra
# NOTE make image smaller
RUN rm -rf ./packages/psydb-fixtures/bson

RUN NODE_ENV=production \
   && apk add --no-cache make gcc g++ python3 curl git sed grep \
   && node ./common/scripts/install-run-rush.js update \
   && node ./common/scripts/install-run-rush.js deploy --target-folder deploy/ \
   && rm -rf ./common/temp/install-run \
   && apk del make gcc g++ python3 curl git sed grep

COPY packages/psydb-ui/dist/ deploy/packages/psydb-ui/dist

# NEW STAGE
FROM node:22.14.0-alpine3.20

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/deploy/common common
COPY --from=builder /usr/src/app/deploy/packages packages

# FIXME: not sure if we want UTC instead
RUN apk add --no-cache tzdata gcompat
ENV TZ="UTC"

EXPOSE 8080

WORKDIR /usr/src/app/packages/psydb-web
VOLUME /usr/src/app/config
CMD npm run production
