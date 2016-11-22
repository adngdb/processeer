#!/bin/sh

AUTH="$KINTO_ADMIN_USER:$KINTO_ADMIN_PASSWORD"

# Create the processeer bucket.
curl -XPUT 'localhost:8888/v1/buckets/processeer' --user $AUTH

# Create a collection for blocks with restricted permissions.
echo '{"permissions": {"record:create": ["system.Authenticated"], "read": ["system.Everyone"]}}' | \
    curl -XPUT 'localhost:8888/v1/buckets/spectateur/collections/blocks' --user $AUTH

# Create a collection for reports with restricted permissions.
echo '{"permissions": {"record:create": ["system.Authenticated"], "read": ["system.Everyone"]}}' | \
    curl -XPUT 'localhost:8888/v1/buckets/spectateur/collections/reports' --user $AUTH
