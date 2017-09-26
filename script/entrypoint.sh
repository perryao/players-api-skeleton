#!/usr/bin/env bash
set -e

# get path of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Wait for postgres then init the db.
if [[ -v CONNECTION_STRING  ]]; then
  HOST=`echo $CONNECTION_STRING | awk -F@ '{print $2}' | awk -F/ '{print $1}'`
  echo "Waiting for host: ${HOST}"
  ${DIR}/wait-for-it.sh ${HOST}
fi

# Run the command.
echo "Executing: $@"
exec $@
