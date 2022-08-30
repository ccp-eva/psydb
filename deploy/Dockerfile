# vim: syn=dockerfile
FROM node:14.15.4-alpine as builder
LABEL stage=psydb_builder

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/deploy
WORKDIR /usr/src/app

# FIXME: maybe not rquired with rush deploy
COPY rush.json /usr/src/app/

COPY common common
COPY packages packages

RUN NODE_ENV=production \
   && apk add --no-cache make gcc g++ python3 curl git sed grep \
   && node ./common/scripts/install-run-rush.js update \
   && node ./common/scripts/install-run-rush.js deploy --target-folder deploy/ \
   && rm -rf ./common/temp/install-run \
   && apk del make gcc g++ python3 curl git sed grep

COPY packages/psydb-ui/dist/ deploy/packages/psydb-ui/ui-bundle

# NEW STAGE
FROM node:14.15.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/deploy/common common
COPY --from=builder /usr/src/app/deploy/packages packages

# FIXME: not sure if we want UTC instead
RUN apk add --no-cache tzdata
ENV TZ="Europe/Berlin"

EXPOSE 80

WORKDIR /usr/src/app/packages/psydb-web
CMD npm run production
