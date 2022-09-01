
```sh
sh docker-image-build.sh
# for local testing
docker run --network="host" cdxoo/psydb:latest

# push to docker registry
sh docker-image-publish.sh
```
