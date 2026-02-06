DEBUG='psydb:*' npm run publicOnlineForm:createSubjectsFromImap -- \
    --psydb-api-key \
    'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHVB1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh' \
    --psydb-url 'http://127.0.0.1:8080/api/' \
    --imap-host '127.0.0.1' \
    --imap-port 3143 \
    --imap-user 'root@example.com' \
    --imap-password 'test1234' \
    --smtp-host '127.0.0.1' \
    --smtp-port 3025 \
    --smtp-user 'root@example.com' \
    --smtp-password 'test1234' \
    --error-mail-from 'db-humankind-registration@example.com' \
    --error-mail-to 'root@example.com' \
    --error-mail-verbose
