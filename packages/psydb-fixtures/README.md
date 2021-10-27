```
mongodump -d psydb -o bson/$(date +%Y-%m-%d)_eva-testing

mongodump -d psydb -o bson/$(date +%Y-%m-%d__%H%M)/
mongorestore --drop -d psydb bson/my-dump/psydb
```
