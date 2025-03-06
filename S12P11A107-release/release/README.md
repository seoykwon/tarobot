:warning: **DO NOT REMOVE ANY DOCKER IMAGES. ALWAYS ONLY STOP THE CONTAINER IF YOU WANT TO TEST SOMETHING** :warning:

# install terminal program
If you do not use terminal program, you will have to ssh into the AWS EC2 server every timeout.   
I used mobaXterm.   
``` ssh -i I12A107T.pem ubuntu@i12a107.p.ssafy.io ```   

I use Docker most of the time, as I do not have permission to access AWS console.   
Turn on *Docker Desktop*. Open cmd/powershell/bash type ```docker login```.   

On the ubuntu server at EC2, also type ```docker login```.   

*I edited some settings so we do not have to use ```sudo``` command everytime we use Docker commands*   
:warning: **BUT IF YOU USE FOLLOWING COMMANDS AFTER YOU SET UP SOME SETTINGS, REMEMBER THEY WILL GET BLOWN AWAY AND YOUR IMAGES WILL BE GONE**   

```sudo addgroup --system docker```   
```sudo adduser $USER docker```   
```newgrp docker```   
```sudo snap disable docker```   
```sudo snap enable docker```   
:warning: DO NOT USE DOCKER IN SNAP IF YOU USE OPENVIDU, IT BRINGS BUGS :warning:   

## How to check running docker containers   
```docker ps``` ```docker ps -a``` show running containers.   

## How to run DBMS (MySQL)
1. SSAFY EC2 only opens port number from 8000 to 8999.   
2. MySQL by default, uses port 3306 in their local host network. We need to bind address accordingly.   
3. This time, I binded to EC2 address 8050.   
4. ```docker run --name mysql -e MYSQL_ROOT_PASSWORD={PWD} -d -p 8050:3306 {mysql-container-name:version} --bind-address=0.0.0.0```   

## How to run spring-backend
1. You need to check that mysql db server is running behind.  
2. ```docker run -i -t -p 8080:8080 <docker-image-name> &```   
3. (```docker run -d 8080:8080 <docker-image-name>``` / ```docker run 8080:8080 <docker-image-name> &``` => are ways to run docker containers in background).   
4. If mysql db server is not running, ```docker run --name mysql-server<version number> -e MYSQL_ROOT_PASSWORD={PWD} -d -p 8050:3306 mysql/mysql-server:8.0 --bind-address=0.0.0.0``` 
5. If mysql container exists, simply do ```docker run <mysql-docker-image>``` / ```docker restart <mysql-docker-image>```

## How to check containers
1. For Spring-backend, go ```i12a107.p.ssafy.io:8080```/ ```43.203.192.90:8080/```.   
2. To check swagger, ```i12a107.p.ssafy.io:8080```/```43.203.192.90:8080/swagger-ui/index.html```.   
3. To check mysql, ```docker exec -it <running-mysql-container-name> bash```.   
3-1. ```mysql -u root -p```.    
3-2. Type "ssafy" as password. You will be able to login.   
