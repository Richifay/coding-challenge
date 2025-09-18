#!/bin/sh
# Substitute PORT environment variable in nginx config
envsubst '$PORT' < /etc/nginx/nginx.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/nginx.conf

# Start nginx
nginx -g "daemon off;"
