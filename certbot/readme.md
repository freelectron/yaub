# Run SSL Certificate renew with letsencrypt and certbot.

## Add a service (job) to the docker compose

Run for renewal of certificates. This used to be in the docker compose config  as:
```
certbot:
   container_name: certbot
   image: certbot/certbot:latest
   depends_on:
     - nginx
   volumes:
     - ${SECRETS_LETSENCRYPT}:/etc/letsencrypt
     - ${SECRETS_CERTBOT_DATA}:/var/www/certbot
   command: >-
     certonly --reinstall --webroot --webroot-path=/var/www/certbot
     --email ${EMAIL} --agree-tos --no-eff-email
     -d yablog.duckdns.org 
```
Process: 
 1. Run the container. Check the logs and see that the certificate is renewed.
 2. Go to  ${SECRETS_LETSENCRYPT} and find the new version of the certificates
 3. Make sure that the configuration of NGINX is now pointing to the new certificate files.  

## WIP: just run with the DockerFile
Now, it is a separated into just a Dockerfile that you need to run whenever you want to renew the certificate.
The result of the command is the same as before, the certificate is saved at `/etc/letsencrypt/live/yablog.duckdns.org-[<version>]/fullchain.pem` and the key is saved at `/etc/letsencrypt/live/yablog.duckdns.org-[<version>]/privkey.pem`.

```bash
source ../.env
docker build -t certbot -t latest . --build-arg EMAIL=${EMAIL} 
docker run --volume $SECRETS_LETSENCRYPT_ABSOLUTE_LOCAL:/etc/letsencrypt -v $SECRETS_CERTBOT_DATA_ABSOLUTE_LOCAL:/var/www/certbot certbot
```
