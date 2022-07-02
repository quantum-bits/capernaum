## Notes from Nginx Documentation

* [Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
* [`http`](https://nginx.org/en/docs/http/ngx_http_core_module.html#http)
* [`server`](https://nginx.org/en/docs/http/ngx_http_core_module.html#server)
* [`location`](https://nginx.org/en/docs/http/ngx_http_core_module.html#location)
* [`root`](https://nginx.org/en/docs/http/ngx_http_core_module.html#root)

Directives placed in the configuration file
outside of any contexts 
are considered to be in the **main context**.
* The `events` and `http` directives 
  reside in the main context
* `server` in `http`
* `location` in `server`

Hence:
```
events { }
http {
  server {
    location { }
  }
}
```

### Serving Static Content
* May have multiple `server` blocks 
  distinguished by _port_ 
  and _server name_.
* Nginx selects a `server` context,
  tests URI in request against
  `location` directives within `server`.
* URI added to path in `root`
  directive to form path on local file system.
* If multiple matching `location` directives,
  select `location` with longest prefix
```
server {
  location / {
    root /data/www;
  }

  location /images/ {
    root /data;
  }
}
```

### Proxy Server

Server receives request, 
passes it to proxied server, 
retrieve response from proxy,
sends response to client. 

```
server {
  listen 8080;
  root /data/up1;

  location / {
  }
}
```
* The `root` directive here is in `server`.
  Used when `location` block doesn't 
  have its own `root` directive.

```
server {
  location / {
    proxy_pass http://localhost:8080/;
  }

  location ~ \.(gif|jpg|png)$ {
    root /data/images;
  }
}
```
