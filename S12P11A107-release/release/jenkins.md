## INSTALL JENKINS ON AWS EC2 SERVER

`java -version Command 'java' not found, but can be installed with`  
When java is not installed, messages come out.  
`sudo apt install openjdk-17-jre-headless`  
**Setting Java 17 as the default version**  
`sudo update-alternatives --config java`

## Set "/etc/profile" env constant

`sudo vi /etc/profile`

add following lines at the bottom of the file.  
`export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`  
`export PATH=$JAVA_HOME/bin:$PATH`  
`export CLASSPATH=$JAVA_HOME/lib`

`source /etc/profile`

## Check that java got installed correctly

`echo $JAVA_HOME`  
`which java`  
`java -version`

## Install "javac"

`sudo apt update`  
`sudo apt install openjdk-17-jdk -y`

## Add Jenkins Repository & Install Jenkins

`wget -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null`

`echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null`

`sudo apt update`  
`sudo apt install jenkins -y`

## Start & Enable Jenkins

`sudo systemctl enable jenkins`  
`sudo systemctl start jenkins`  
`sudo systemctl status jenkins`

`sudo ufw allow 8080`

## Get Jenkins Admin Password

`sudo cat /var/lib/jenkins/secrets/initialAdminPassword`

## Check if your gitlab token works

`git clone https://oauth2:YOUR_ACCESS_TOKEN@lab.ssafy.com/s12-webmobile1-sub1/S12P11A107.git`  
**Make sure you set the role of access token as either developer/maintainer**

## Trouble Shooting

`Started by user admin`  
`ERROR: Unable to find /Jenkinsfile from git https://lab.ssafy.com/s12-webmobile1-sub1/S12P11A107.git Finished: FAILURE`

1. You are not supposed to use "/Jenkinsfile" as it is an absolute path. Use "Jenkinsfile".
2. Do not use "_/master" or "_/branch_name" (aka. wildcard). Use "origin/branch_name" instead.

"Caused by: hudson.plugins.git.GitException: Command "git fetch --tags --force --progress -- git@lab.ssafy.com:s12-webmobile1-sub1/S12P11A107.git +refs/heads/_:refs/remotes/origin/_" returned status code 128:
stdout:
stderr: ssh: connect to host lab.ssafy.com port 22: Connection timed out
fatal: Could not read from remote repository."

Please make sure you have the correct access rights
and the repository exists. 3. In "Jenkinsfile", do not use commented out line below.

```Jenkinsfile
  stage('Clone Repository') {
              steps {
                  git branch: 'main', url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11A107.git', credentialsId: 'gitlab-credentials'
                  // git branch: 'main', url: 'git@lab.ssafy.com:s12-webmobile1-sub1/S12P11A107.git', credentialsId: 'gitlab-credentials'

              }
          }
```

## Couldn't find any revision to build

이는 Jenkins가 지정된 release/backend 브랜치를 찾지 못해 발생하는 문제입니다. 이는 git 명령어가 해당 브랜치를 찾지 못하고 있기 때문입니다.  
`refs/heads/release/backend`

## How to check Jenkins status

`systemctl status jenkins`

- Press `ctrl + c` to stop seeing the log

## ./gradlew: not found

- In your EC2 server, run  
  `cd /var/lib/jenkins/workspace/spring-backend`  
  `ls -l gradlew`

`ls: cannot access 'gradlew': No such file or directory`

## add gradlew

- remove old grade  
  `sudo apt remove --purge gradle -y`
- download gradle  
  `wget https://services.gradle.org/distributions/gradle-8.3-bin.zip -P /tmp`
- extract & move to /opt/gradle
  `sudo mkdir -p /opt/gradle`  
  `sudo unzip -d /opt/gradle /tmp/gradle-8.3-bin.zip`
- set up environment variables

```sh
echo "export GRADLE_HOME=/opt/gradle/gradle-8.3" >> ~/.bashrc
echo "export PATH=\$GRADLE_HOME/bin:\$PATH" >> ~/.bashrc
source ~/.bashrc
```

- for Jenkins, update /etc/environment

```sh
sudo nano /etc/environment
```

- add:

```ini
GRADLE_HOME=/opt/gradle/gradle-8.3
PATH="$GRADLE_HOME/bin:$PATH"
```

- apply changes

```sh
source /etc/environment
```

- verify installation  
  `gradle -v`

## Check port

`sudo cat /etc/default/jenkins | grep HTTP_PORT`

## ssh: connect to host <EC2_IP> port 22: Network is unreachable

- 상대방 서버에서 ICMP 응답을 차단
- 대상 IP `43.203.192.90`가 ping 응답을 비활성화했을 가능성.

```sh
curl -I http://43.203.192.90
telnet 43.203.192.90 80
```

- curl & telnet 모두 "connection refused" 오류 발생  
  1️⃣ 대상 서버(43.203.192.90)에서 포트(80) 차단
- Connection refused는 서버가 요청을 거부한다는 의미입니다.
- 즉, 서버가 동작하고 있지만 포트 80(http)이 열려 있지 않거나, 방화벽에서 차단되었을 가능성이 큽니다.
- 서버가 꺼져 있는 경우라면 "Connection timed out" 오류가 발생해야 하는데, "refused"라는 것은 서버가 살아있다는 뜻입니다.

현재 curl과 telnet을 사용하여 43.203.192.90 서버의 80번 포트와 443번 포트에 접속을 시도했지만, "Connection refused" 오류가 발생하고 있습니다. 원인은 다음과 같을 가능성이 높습니다.

1. 서버에서 80번, 443번 포트가 열려 있지 않음  
   sudo netstat -tulnp | grep LISTEN 결과를 보면, 현재 80번(HTTP)과 443번(HTTPS) 포트에서 수신(Listen)하는 서비스가 없습니다. 즉, 웹 서버가 실행되지 않은 상태입니다.

🔹 해결 방법  
웹 서버(Nginx, Apache 등)를 실행해야 합니다.

```bash
sudo systemctl start nginx
```

## Install nginx

```bash
sudo apt update
sudo apt install nginx -y
```

`sudo systemctl start nginx`

## Jenkins Timezone configuration

By default, the timezone is set to UTC.

1. Check server system timezone : `timedatectl`
2. If the output is not the timezone you want (local time/ time zone)
3. Change the time zone `sudo timedatectl set-timezone Asia/Seoul`
4. Since Jenkins is a Java application, we also need to set Java timezone.  
   `java -Duser.timezone=Asia/Seoul -jar -XshowSettings:properties -version 2>&1 | grep timezone`
5. If the Java timezone does not match:  
   5-1. `sudo nano /etc/default/jenkins`
   5-2. `JAVA_ARGS="-Duser.timezone=Asia/Seoul"`
6. Check inside Jenkins if timezone got changed:  
   6-1. Jenkins Dashboard -> Manage Jenkins -> Script console  
   6-2. `println new Date()`

## Permission denied

````sh
/var/lib/jenkins/workspace/spring-backend/backend/gradlew build
/var/lib/jenkins/workspace/spring-backend@tmp/durable-ee7c82fc/script.sh.copy: 1: /var/lib/jenkins/workspace/spring-backend/backend/gradlew: Permission denied```
```sh
/var/lib/jenkins/workspace/spring-backend/backend$ chmod +x gradlew
chmod: changing permissions of 'gradlew': Operation not permitted
````

![top snapshot](image.png)

1. user name 바꿔줌 젠킨스로.
2. 젠킨스에서 gradlew 권한 넣어줌
3. 근데 권한이 자꾸 사라짐
4. 이는 CICD 파이프라인에서 캐시 문제임
5. 젠킨스가 sudo 권한이 없어서 젠킨스파일에서 chmod로 권한을 못 넣어줌

6. 폴더의 하위권한을 가질 수 있게 폴더의 권한을 주면 됨.
7. 앞으로 수많은 빌드를 할 때마다 권한을 바꾸는 것은 시간을 많이 잡아먹음.
8. 시간이 촉박하기에 보안면에서 안 좋은 방법이지만 젠킨스에 sudo 권한을 넣어줌.
9. 루트 비밀번호 바꿔줌 `sudo passwd root`

The error you're encountering suggests that Jenkins is running the Gradle build from the /var/lib/jenkins/workspace/spring-backend directory, but your settings.gradle file is located under the backend subdirectory, which is why Jenkins cannot find it.

Why Jenkins Can't Find the Gradle Files
By default, Jenkins executes the build from the root of the workspace, which is /var/lib/jenkins/workspace/spring-backend. Since your settings.gradle is inside the backend folder, Jenkins is not able to detect it from the root workspace.

-> add dir('backend') { } block.

## Change default port of Jenkins to 8070

`ubuntu@ip-172-26-12-83:/usr/lib/systemd/system$ sudo vim jenkins.service`  
JENKINS_PORT={PORT_NUMBER}

1. `sudo systemctl jenkins stop`
2. `sudo systemctl start jenkins`

## Send Docker image from Jenkins to EC2

1. Jenkins에서 EC2로 Docker 이미지 직접 전송 및 실행  
   1-1. EC2에서 Docker 이미지 받아 실행하기 (SSH 통해 EC2에 접속하고, docker pull을 사용하여 이미지를 EC2에서 다운로드하고 실행)  
   1-2. Jenkins pipeline에 EC2 배포 단계 추가

## Check firewall rules

`sudo ufw status`  
`sudo ufw allow 8070`

## Docker image transfer from Jenkins to Ubuntu

```sh
docker save -o /home/ubuntu/spring-server.tar ${DOCKER_IMAGE}
docker load -i /home/ubuntu/spring-server.tar
docker run -d -p 8080:8080 ${DOCKER_IMAGE}
```

## Permission denied

```sh
+ docker save -o /home/ubuntu/spring-server.tar spring-backend:ba0e1da
open /home/ubuntu/.docker_temp_2172974198: permission denied
```

## EOF: not found

- EOF  
  /var/lib/jenkins/workspace/spring-backend@tmp/durable-f88fd281/script.sh.copy: 5: EOF: not found

# yaml: line 22: did not find expected key

- suggests that there's a syntax issue in your "docker-compose.yml" file.

## Dockerfile grammar issue
```failed to solve: failed to compute cache key: failed to calculate checksum of ref 3381c1f6-4a17-4dea-8edc-cfcfa2227fad::am1p8sui1fojsboa48ketcdt3: "/var/lib/jenkins/workspace/rag-pipeline/rag_pipeline/app": not found```   
This error occurs despite the file/directory exists in the absolute path.  
:warning: Docker cannot access files outside the context (where Dockerfile exists) :warning:   
This means, although you provide absolute path where file exists in the EC2, Dockerfile will not be able to spot the files because it is out of context.   
Thus, remove absolute paths in ```COPY``` (Dockerfile)   
When writing Jenkinsfile grammar, use ```dir('') {}``` block to navigate current context to where you want to navigate the point to.   

## .env shoudl be encoded in UTF-8 and should not contain characters other than ASCII 
1. If we just copy and paste .env file from local to EC2, sometimes commented out lines contain emoji, and this results in troubles.  
2. Also, if the OS of your local and EC2 differs, you have to change the encoding to UTF-8.   
3. It is often to permitted for ubuntu (user of EC2) to create .env file.   
4. Moreover, even though you created, usually you do not have permission to write the file.   
  4-1. ```ls -l```   to check the permissions of the directory you're trying to create the ".env" file.   
  4-2. ```sudo chown -R ubuntu:ubuntu /var/lib/jenkins/workspace/rag-pipeline/rag_pipeline```  Change ownership of the directory. (If the directory is owned by a different user)   
  4-3. ```sudo chmod -R u+w /var/lib/jenkins/workspace/rag-pipeline/rag_pipeline```  Change the permissions of the directory.   
  4-4. ```sudo touch .env```    
  4-5. ```ls -l .env```  if the permissions is like ```-rw-r--r-- 1 ubuntu ubuntu 0 Feb 17 14:50 .env```, this line shows that the file has read and write permissions for the owner 'ubuntu', and only read permissions for the group and others.   
  4-6. To add write permission for the file owner ```chmod u+w .env```   
  4-7. To add write permission to the group ```chmod g+w .env```   
  4-8. To add write permission to everyone (owner, group, others) ```chmod a+w .env```   
  4-9. Make the file writable by everyone (optional and not recommended for security reasons) ```sudo chmod 666 .env```   
