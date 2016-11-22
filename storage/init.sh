#!/bin/sh

AUTH="$KINTO_ADMIN_USER:$KINTO_ADMIN_PASSWORD"

# Create the processeer bucket.
curl -XPUT 'localhost:8888/v1/buckets/processeer' --user $AUTH

# Create a collection for blocks with restricted permissions.
curl -XPUT 'localhost:8888/v1/buckets/processeer/collections/blocks' \
    --user $AUTH \
    -H "Content-Type: application/json" \
    -d '{"permissions": {"record:create": ["system.Authenticated"], "read": ["system.Everyone"]}}'

# Create a collection for reports with restricted permissions.
curl -XPUT 'localhost:8888/v1/buckets/processeer/collections/reports' \
    --user $AUTH \
    -H "Content-Type: application/json" \
    -d '{"permissions": {"record:create": ["system.Authenticated"], "read": ["system.Everyone"]}}'
