:video_camera: **OPENVIDU TROUBLE SHOOTING LOG** :video_camera:

## OpenVidu Official Document is not working well
[OpenVidu Document](https://docs.openvidu.io/en/stable/deployment/ce/on-premises/)   
Since, we cannot access AWS console, I followed On-Premises method.   
**Error response from daemon: error while creating mount source path '/opt/openvidu/kurento-logs': mkdir /opt/openvidu: read-only file system**   
It seems there is no reasonable file permission granted to *opt/root.*   

## How to solve the "read-only file system" issue?
[Solution](https://openvidu.discourse.group/t/mkdir-opt-openvidu-read-only-file-system/837/8)   
We already have running containers in Docker, so I cannot simply do "uninstall Docker and use the official script to reinstall the latest version of Docker".   
Obviously, there is an issue with *Docker in Snap* (Snap package version of Docker, which is an alternative way to install Docker on Linux distributions that support Snap (such as Ubuntu)).   

## Deleting Docker in Snap and reinstalling Docker for OpenVidu
[INSTALL DOCKER ENGINE ON UBUNTU](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)    

1. Error occurred: *Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?*   
[CANNOT CONNECT TO DOCKER DAEMON 1](https://forums.docker.com/t/wsl-cannot-connect-to-the-docker-daemon-at-unix-var-run-docker-sock-is-the-docker-daemon-running/116245/6)    
[CANNOT CONNECT TO DOCKER DAEMON 2](https://techkluster.com/docker/questions-docker/cannot-connect-to-the-docker-daemon-at-unix/)
2. How to resolve the error:    
```ubuntu@ip-172-26-12-83:/run$ groups ubuntu```    
```ubuntu : ubuntu adm dialout cdrom floppy sudo audio dip video plugdev netdev lxd```   
Ubuntu was not able to connect to Docker socket somehow. When I checked, there was no *docker* in ubuntu user.   


## How to check if Docker is installed via Snap
```snap list | grep docker```   
- If this returns output like docker ... canonical✓ ..., then Docker is installed via Snap.    
- If there's no output, then Docker is not installed via Snap.   
```which docker```    
- /snap/bin/docker -> Snap     
- /usr/bin/docker -> not a Snap.   

## Configuration bug
```openvidu-server-1  |
openvidu-server-1  |
openvidu-server-1  |    Configuration errors
openvidu-server-1  |    --------------------
openvidu-server-1  |
openvidu-server-1  |    * Property OPENVIDU_SECRET={KEY}. Cannot be empty and must contain only alphanumeric characters [a-zA-Z0-9], hypens ("-") and underscores ("_")
openvidu-server-1  |
openvidu-server-1  |
openvidu-server-1  |    Fix config errors
openvidu-server-1  |    ---------------
openvidu-server-1  |
openvidu-server-1  |    1) Return to shell pressing Ctrl+C
openvidu-server-1  |    2) Set correct values in '.env' configuration file
openvidu-server-1  |    3) Restart OpenVidu with:
openvidu-server-1  |
openvidu-server-1  |       $ ./openvidu restart
openvidu-server-1  |
openvidu-server-1  |
```   
**delete inappropriate ASCII codes**   

## Dying after one connection
```222.107.238.18 - - [12/Feb/2025:07:12:16 +0000] "GET / HTTP/1.1" 301 162 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36" "-"
```   
300s http error -> redirection issue.   
(400s -> client / 500s -> server)    

## Change port mapping for coturn
```4c36015368e8   openvidu/openvidu-coturn:2.31.0      "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes             0.0.0.0:3478->3478/tcp, 0.0.0.0:3478->3478/udp, :::3478->3478/tcp, :::3478->3478/udp, 5349/tcp, 5349/udp   openvidu-coturn-1
```    
- I added some lines on "docker-compose.override.yml" file, but it did not solve the issue. Or the issue is so interconnected, that solving one spot is not resolving the whole problem.   
```# --------------------------------------------------------------
    # Coturn service configuration
    # --------------------------------------------------------------
    openvidu-coturn:
        image: openvidu/openvidu-coturn:2.31.0
        ports:
            - "8478:3478"  # Map external port 8478 to internal port 3478
            - "5349:5349"  # Secure port (if needed)
        environment:
            - TURN_LISTEN_PORT=8478    # Set TURN server listening port to 8478
            - TURN_LISTEN_PORT_TCP=8478
            - TURN_LISTEN_PORT_UDP=8478
            - TURN_SECRET=${TURN_SECRET:-}  # Optional: Use TURN secret if defined
        restart: on-failure
```    

## There is no REDIS somehow, openvidu-openvidu-coturn-1 keeps dying and restarting because of SHARED-SECRET-KEY