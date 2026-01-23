#!/bin/bash

set -euo pipefail

APP_NAME="signer"
ARCHIVE_NAME="${APP_NAME}-build.tar.gz"
REMOTE_TMP="/tmp/${ARCHIVE_NAME}"
REMOTE_HOST="root@5.23.48.222"
TARGET_DIR="/var/www/signer"


echo "📦 Building application"
npm run build

tar -czf "${ARCHIVE_NAME}" -C .output/public .

echo "🏗️  Moving archive to ${REMOTE_HOST}:${TARGET_DIR}"
scp "${ARCHIVE_NAME}" "${REMOTE_HOST}:${REMOTE_TMP}"

echo "🚀 Deploying archive..."
ssh -t "${REMOTE_HOST}" "\
	rm -rf ${TARGET_DIR} && \
	mkdir -p ${TARGET_DIR} && \
	tar -xzf ${REMOTE_TMP} -C ${TARGET_DIR} && \
	rm -f ${REMOTE_TMP}"

rm -f "${ARCHIVE_NAME}"


echo "✅ Deployed to ${REMOTE_HOST}:${TARGET_DIR}"
