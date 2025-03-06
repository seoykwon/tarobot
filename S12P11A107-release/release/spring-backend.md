:leaves: **Spring boot server release trouble shooting log** :leaves:

## Make sure you change server binding address
1. Go to ```backend/src/main/resources/application.properties```    
2. Change *server.address* from **localhost** to **0.0.0.0**   

## Rebuild the docker image
1. Gradle -> build/bootJar -> create *.jar file in "builds/libs" directory.    
2. Create and write contents of Dockerfile.    
```Dockerfile
FROM openjdk:17
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```    
3. ```docker build --tag {dockerimage-name:version} . ```   
4. if you are using MacOS, try ```docker build --platform amd64 --build-arg DEPENDENCY=build/dependency --tag {dockerimage-name:version} .```   
5. (Do not forget the dot at the end, or you will get the following error message : "docker build" requires exactly 1 argument.
See 'docker build --help'.)   

## Run Spring boot server
1. ```docker run -i -t -p 8070:8080 {docker-image-name} &```   

## If the docker container exits within a few seconds, the reasons are either:
1. DB connection failure. However, If you follow the mysql-db.md file, you will be able to connect your spring server to db.   
2. Constants environment missing. ".env" file is ignored by git, so it does not get automatically pulled from clone command line.   
3. There are few choices, but I recommend adding ".env" file manually to the directory path in your EC2.   