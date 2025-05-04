# Quick Start

```
    sh up.sh
    sh restore-dump mongodb-dumps/init-childlab-with-dummy-data
        # or mongodb-dumps/init-childlab-structure-only
        # or mongodb-dumps/init-minimal
```

* root user credentials are: "root@example.com" // "test1234"
* Webserver (nginx) will listen on 0.0.0.0:80
  also accepting connections from other machines;
  SSL is NOT enabled in this test deployment; to enable SSL edit
  ./psydb-config-volume/nginx/default.conf
* MongoDB will listen to 127.0.0.1:47017 only for the host machine
* MailHog web interface is listening on 0.0.0.0:8025 also accepting
  connections from other machines (also no SSL); MailHog only serves for
  testing SMTP capabilities and sould be replaced with an actual mail server;
  configure ./psydb-config-volume/psydb/config.js accordingly
* additionally the psydb instance is accessible on 127.0.0.1:8080;
  this should not be neccessary under normal circumstances
* there exist 3 initial database dumps in ./mongodb-dumps
    * "init-minimal" only creates the initial root user
    * "init-childlab-structure-only" creates the initial root user
      and the database structure according to how the EVA ChildLab uses
      the application
    * "init-childlab-with-dummy-data" is the same as above but includes
      some dummy data as well; this dump also creates 2 other users
      that have different roles with reduced permissions
      (use their email as username; passwords are "test1234" as well)
