#!/bin/sh

AUTH="$KINTO_ADMIN_USER:$KINTO_ADMIN_PASSWORD"

echo "Create the processeer bucket."
curl -XPUT 'localhost:8888/v1/buckets/processeer' --user $AUTH

echo ''
echo "Create a collection for blocks with restricted permissions."
curl -XPUT 'localhost:8888/v1/buckets/processeer/collections/blocks' \
    --user $AUTH \
    -H "Content-Type: application/json" \
    -d '{"permissions": {"write": ["system.Authenticated"], "read": ["system.Everyone"]}}'

echo ''
echo "Create a collection for reports with restricted permissions."
curl -XPUT 'localhost:8888/v1/buckets/processeer/collections/reports' \
    --user $AUTH \
    -H "Content-Type: application/json" \
    -d '{"permissions": {"write": ["system.Authenticated"], "read": ["system.Everyone"]}}'
