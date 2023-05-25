# NGINX Reverse-Proxy

Here is the proxy definition from docker-compose.yml:

```yaml
  proxy:
    <<: *defaults
    image: nginx:1.23.4-alpine
    depends_on:
      - frontend
      - backend
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/proxy.conf:/etc/nginx/proxy.conf
      - ./nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
```

[nginx config directory](nginx)

The NGINX config is minimal. The reverse-proxy routes pathnames that begin with `/nest` to the NestJS server, otherwise it sends requests to the NextJS frontend.

### [default.conf](nginx/conf.d/default.conf)

```Nginx
upstream nextjs_upstream {
    server frontend:3000;
}

upstream nestjs_upstream {
    server backend:3333;
}

server {
        listen 80 reuseport default_server;
        listen [::]:80 reuseport default_server;

        gzip on;
        gzip_proxied any;
        gzip_comp_level 4;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

        location /nest {
            include /etc/nginx/proxy.conf;
            proxy_pass http://nestjs_upstream;
        }

        location / {
            include /etc/nginx/proxy.conf;
            proxy_pass http://nextjs_upstream;
        }
}
```
