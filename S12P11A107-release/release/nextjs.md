**NEXTJS DOCKER CONTAINER TROUBLE SHOOTING LOG**

## 1. Node.js 18 버전 사용
FROM node:18-alpine

## 2. 작업 디렉토리 설정
WORKDIR /app

## 3. 프로젝트 파일 복사
COPY package.json package-lock.json ./
RUN npm install --omit=dev

## 4. Next.js 프로젝트 전체 복사 및 빌드
COPY . .
RUN npm run build

## 5. Next.js 실행 (8020 포트)
CMD ["npm", "run", "start"]

```cd frontend```   
```docker build -t my-next-app .```    

```docker save -o nextjs_image.tar my-next-app```   

```scp -i "C:/Users/SSAFY/I12A107T.pem" nextjs_image.tar ubuntu@i12a107.p.ssafy.io:~```   

```ssh -i "C:/Users/SSAFY/Desktop/I12A107T.pem" ubuntu@i12a107.p.ssafy.io:~```   

```docker load -i nextjs_image.tar```   

```docker run -d -p 8020:3000 --name nextjs_container my-next-app```   

## Check
http://i12a107.p.ssafy.io:8060/

## ```sh: next: Permission denied```
the next command is not executable inside the Docker container.   

🔍 Possible Causes:
1. Next.js CLI (node_modules/.bin/next) does not have execution permissions.   
2. Running as a non-root user in the container, and file permissions are incorrect.   
3. Corrupt or missing dependencies in node_modules.   
