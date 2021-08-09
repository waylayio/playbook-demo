FROM abiosoft/caddy:no-stats

ADD Caddyfile /etc/Caddyfile
ADD dist/ /srv

EXPOSE 2015