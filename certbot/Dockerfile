# Use the official Certbot image as the base
FROM certbot/certbot:latest

# Set environment variables for customization
ARG WEBROOT_PATH="/var/www/certbot"
ARG DOMAIN="yablog.duckdns.org"
ARG EMAIL

# Create the webroot directory
#RUN mkdir -p $WEBROOT_PATH && \
#    chown -R certbot:certbot $WEBROOT_PATH

ENTRYPOINT [">-", "certonly --reinstall --webroot --webroot-path=$WEBROOT_PATH --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN"]
#CMD ["certonly"]
