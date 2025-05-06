# convince npm to install global packages/executables in the
# homedirectory
export NPM_CONFIG_PREFIX="~/.npm-global"
# add path to npm folder accordinglyi
PATH="/home/### MY_USER ###/.npm-global/bin:$PATH"

# use ssh deploy key
export GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa_psydb_deploy -F /dev/null -o 'IdentitiesOnly yes'"
