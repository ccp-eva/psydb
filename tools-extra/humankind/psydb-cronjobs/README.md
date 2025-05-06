
# Scripts for Humankind Deployment

Theese scripts are used in cronjobs related to the Humankind Deployment.

```bash
npm run [script] -- [options]
```

- publicOnlineForm:createSubjectsFromImap


## publicOnlineForm:createSubjectsFromImap

This command connects to an IMAP server to process emails and creates subjects via the PsyDB API. It may send error reports using SMTP.


### Usage

```bash
npm run publicOnlineForm:createSubjectsFromImap -- [options]
```

#### Example:

```bash
npm run publicOnlineForm:createSubjectsFromImap -- \
    --psydb-api-key yourApiKey \
    --imap-host imap.example.com \
    --smtp-host smtp.example.com
```

### Options

| Option                                | Description                                                                 | Default Value                                 |
|---------------------------------------|-----------------------------------------------------------------------------|---------------------------------------------|
| `-V, --version`                       | Output the version number                                                   |                                             |
| `--psydb-api-key <psydbApiKey>`       | API key to authenticate with PsyDB                                          |                                             |
| `--psydb-url <psydbUrl>`              | PsyDB URL                                                                   | `http://127.0.0.1:8080/api/`                |
| `--psydb-verbose`                     | Enable verbose PsyDB driver logging                                         | `false`                                     |
| `--imap-host <imapHost>`              | IMAP hostname or IP                                                         | `127.0.0.1`                                 |
| `--imap-port <imapPort>`              | IMAP port                                                                   | `143`                                       |
| `--imap-user <imapUser>`              | IMAP login user                                                             |                                             |
| `--imap-password <imapPassword>`      | IMAP login password                                                         |                                             |
| `--imap-ssl`                          | Use SSL for IMAP connection                                                 | `false`                                     |
| `--imap-verbose`                      | Enable verbose IMAP logging                                                 | `false`                                     |
| `--smtp-host <smtpHost>`              | SMTP hostname or IP                                                         | `127.0.0.1`                                 |
| `--smtp-port <smtpPort>`              | SMTP port                                                                   | `25`                                        |
| `--smtp-user <smtpUser>`              | SMTP login user                                                             |                                             |
| `--smtp-password <smtpPassword>`      | SMTP login password                                                         |                                             |
| `--smtp-ssl`                          | Use SSL for SMTP connection                                                 | `false`                                     |
| `--smtp-verbose`                      | Enable verbose SMTP logging                                                 | `false`                                     |
| `--error-mail-from <errorMailFrom>`   | Sender address for error mail                                               | `online-registration@example.com`           |
| `--error-mail-to <errorMailTo>`       | Recipient address for error mail                                            | `registration-errors@example.com`           |
| `--error-mail-verbose`                | Include stack info in error mail                                            | `false`                                     |
| `--dry`                               | Full dry run                                                                | `false`                                     |
| `--dry-no-move-mails`                 | Partial dry run - don't move mails from inbox                               | `false`                                     |
| `--dry-no-error-mails`                | Partial dry run - don't send error mails                                    | `false`                                     |
| `--dry-no-create-subjects`            | Partial dry run - don't create subjects in the database                     | `false`                                     |
| `-h, --help`                          | Display help for the command                                                |                                             |

### Notes

- **Dry Run Modes**: The `--dry` option and its variations allow you to test the script without making actual modifications (e.g., no database updates, no email movements).
- **Error Mail Configuration**: You can customize the sender and recipient addresses for error mails using the `--error-mail-from` and `--error-mail-to` options.
- **Verbose Logging**: The `--psydb-verbose`, `--imap-verbose`, and `--smtp-verbose` options enable detailed logs for debugging purposes.
- **Debugging**: You can enable further logging via `DEBUG` environment variable `DEBUG='psydb:humankind-cronjobs:*'` for local scope. Use `DEBUG='*'` for full debug scope.

### Requirements

- A valid PsyDB API key (`--psydb-api-key`).
- Access to an IMAP server for processing emails.
- Optionally, access to an SMTP server for sending error reports.

For more information, run the command with the `--help` flag:

```bash
npm run publicOnlineForm:createSubjectsFromImap -- --help
```
