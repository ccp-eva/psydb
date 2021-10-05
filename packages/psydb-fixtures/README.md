mongodump --gzip -d psydb -o bson/my-dump/
mongorestore --gzip --drop -d psydb bson/my-dump/psydb
