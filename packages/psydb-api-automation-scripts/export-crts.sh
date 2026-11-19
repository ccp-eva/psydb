#!/usr/bin/env bash
# Downloads a crt export from a psydb instance.
# The result can be fed into the "import-crt-export" automation script
# (--input-file) on another system.
#
# usage: ./export-crts.sh --api-key <key> [--url <psydb-api-url>] [--out <file>]
#
# NOTE: the api key must belong to a root account, api key auth must be
# enabled in the api config and the caller ip must be in allowedIps
set -euo pipefail

URL='http://127.0.0.1:8080/api/'
API_KEY="${PSYDB_API_KEY:-}"
OUT=''

while [[ $# -gt 0 ]]; do
    case "$1" in
        --api-key) API_KEY="$2"; shift 2 ;;
        --url) URL="$2"; shift 2 ;;
        --out) OUT="$2"; shift 2 ;;
        -h|--help) sed -n '2,9p' "$0" | sed 's/^# \?//'; exit 0 ;;
        *) echo "unknown option: $1" >&2; exit 1 ;;
    esac
done

if [[ -z "$API_KEY" ]]; then
    echo 'missing --api-key (or PSYDB_API_KEY env var)' >&2
    exit 1
fi

if [[ -z "$OUT" ]]; then
    OUT="crt-export_$(date -u +%Y-%m-%dT%H-%M-%S).ejson"
fi

ENDPOINT="${URL%/}/crt-settings/export"

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

STATUS=$(curl -sS -G "$ENDPOINT" \
    --data-urlencode "apiKey=$API_KEY" \
    -o "$TMP" -w '%{http_code}')

if [[ "$STATUS" != '200' ]]; then
    echo "export failed with http status $STATUS" >&2
    head -c 1000 "$TMP" >&2; echo >&2
    exit 1
fi

mv "$TMP" "$OUT"
trap - EXIT
echo "written: $OUT"
