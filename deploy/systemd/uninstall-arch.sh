systemctl stop psydb-ui.service
systemctl stop psydb-api.service

rm /usr/lib/systemd/system/psydb-api.service
rm /usr/lib/systemd/system/psydb-ui.service

userdel -r psydb
groupdel psydb
