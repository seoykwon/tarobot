:bookmark_tabs: **Records of Trouble Shooting while Trying to Set up DBMS (MYSQL) Environment** :bookmark_tabs:

## Check port status

`sudo ufw status` / `sudo ufw allow 8050/tcp`

## Create base image

1. `docker pull mysql:8`

## Implement binding address

1. Go to `backend/src/main/resources/application.properties`
2. Comment out `# Import .env file spring.config.import=optional:file:.env[.properties]` as we are not using .env file for constants.
3. Modify `spring.datasource.url=jdbc:mysql://43.203.192.90:8050/ssafy_web_db?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul&zeroDateTimeBehavior=convertToNull&rewriteBatchedStatements=true` /  
   `spring.datasource.hikari.username=root` /  
   `spring.datasource.hikari.password={PWD}`
4. Build docker image with spring boot backend server.
5. `docker run --name {NAME} -e MYSQL_ROOT_PASSWORD={PWD} -d -p 8050:3306 {mysql-image-name} --bind-address=0.0.0.0`

## Put permission into user to enable access from outside network

1. `docker exec -it {mysql-running-container-name} bash`
2. `mysql -u root -p`
3. `CREATE DATABASE ssafy_web_db;`
4. `SHOW DATABASES;`
5. `USE ssafy_web_db;`
6. `create user 'root'@'%' identified by 'PWD';`
7. `grant all privileges on *.* to root@'%';`
8. `select host from mysql.user where user='root';`
9. `alter user 'root'@'%' identified with mysql_native_password by 'PWD';`
10. `flush privileges;`

## Deploying to EC2 trouble shooting

Allow External MySQL Connections  
`sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf`  
`bind-address = 0.0.0.0`
