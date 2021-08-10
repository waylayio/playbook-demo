FROM abiosoft/caddy:no-stats

ADD Caddyfile /etc/Caddyfile
ADD build/ /srv

EXPOSE 2015