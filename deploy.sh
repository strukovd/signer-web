#!/bin/bash

set -euo pipefail

ARCHIVE_NAME="signer-build.tar.gz"
REMOTE_TMP="/tmp/${ARCHIVE_NAME}"
REMOTE_HOST="root@5.23.48.222"
TARGET_DIR="/var/www/signer"
SSH_KEY="~/.ssh/id_rsa"

npm run build

tar -czf "${ARCHIVE_NAME}" -C .output/public .

scp -i "${SSH_KEY}" "${ARCHIVE_NAME}" "${REMOTE_HOST}:${REMOTE_TMP}"

ssh -t -i "${SSH_KEY}" "${REMOTE_HOST}" "\
	rm -rf ${TARGET_DIR} && \
	mkdir -p ${TARGET_DIR} && \
	tar -xzf ${REMOTE_TMP} -C ${TARGET_DIR} && \
	rm -f ${REMOTE_TMP}"

rm -f "${ARCHIVE_NAME}"
