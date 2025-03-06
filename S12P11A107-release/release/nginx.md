## Nginx 설정 파일 확인 및 수정
mapping example:    
```bash
server {
    listen 80;
    server_name 43.203.192.90;  # 서버의 IP 주소 또는 도메인

    location / {
        proxy_pass http://localhost:3000;  # 프론트엔드가 동작하는 포트
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```   
위의 예시에서는 Nginx가 80번 포트에서 들어오는 HTTP 요청을 받아서 localhost:3000 으로 전달.    

## Certbot 설치 및 SSL 인증서 받기
1. Certbot 설치:
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```
2. SSL 인증서 요청   
```sudo certbot --nginx -d 43.203.192.90```    

3. 자동 갱신 설정    
인증서를 갱신하려면 매 90일마다 인증서를 갱신. Certbot은 자동 갱신 기능이 있어, cron이나 systemd로 설정할 수 있음. 기본적으로는 아래 명령어로 갱신 확인이 가능.   
```sudo certbot renew --dry-run```   

## Nginx 설정 적용
```sudo systemctl restart nginx```   

## HTTP에서 HTTPS로 리디렉션 설정
```bash
server {
    listen 80;
    server_name 43.203.192.90;

    location / {
        return 301 https://$host$request_uri;
    }
}
```

## Map each port with Nginx
To my Spring, FastAPI, Next.js services with Nginx, I need to configure server blocks (virtual hosts) for each service. These configurations will proxy traffic from your domain to the appropriate service based on the requested path or port.   

**Steps**   
1. Create server block configurations for each service.   
2. Use ```proxy_pass``` in Nginx to forward traffic to the appropriate service on its port.   
3. Make sure Nginx is listening on port 80 (HTTP) and 443 (HTTPS, if SSL is set up later).   
4. Restart Nginx after changes.   

### 1. Create a new configuration file for your domain   
```sudo nano /etc/nginx/sites-available/i12a107.p.ssafy.io```    
```nginx
server {
    listen 80;
    server_name i12a107.p.ssafy.io;  # your domain

    # Proxy to Spring application (port 8080)
    location /spring/ {
        proxy_pass http://43.203.192.90:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy to FastAPI application (port 8040)
    location /fastapi/ {
        proxy_pass http://43.203.192.90:8040/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy to Next.js application (port 8060)
    location /nextjs/ {
        proxy_pass http://43.203.192.90:8060/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Optional: redirect HTTP to HTTPS for secure access later (if you configure SSL)
    # return 301 https://$server_name$request_uri;
}
```

### 2. Create a symbolic link to enable the site
After creating the configuration file, enable it by creating a symbolic link to the ```/etc/nginx/sites-enabled/``` directory.   
```sudo ln -s /etc/nginx/sites-available/i12a107.p.ssafy.io /etc/nginx/sites-enabled/```   

### 3. Check the Nginx configuration
It's always a good idea to check if there are any syntax errors before reloading Nginx:   
```sudo nginx -t```   
If everything is fine, you'll see a message like:   
```nginx: configuration file /etc/nginx/nginx.conf test is successful```  

### 4. Reload Nginx to apply the changes
```sudo systemctl reload nginx```   

### Spring & Next.js 에서 통신할 때 사용하는 API들이 다 다르기 때문에 Nginx에서 예외 처리로 다 구현해 줘야 함.....
