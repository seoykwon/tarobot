# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /project

# Install Gradle
RUN apt-get update && apt-get install -y gradle

# Default command to keep the container running
CMD ["bash"]
