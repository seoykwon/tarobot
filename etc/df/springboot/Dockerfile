# # Stage 1: Build the application
# FROM gradle:8.3-jdk17 AS builder

# # Set the working directory inside the container to the "app" folder
# WORKDIR /app

# # Copy only the "app" folder from your local machine into the container's "/app" folder
# COPY app/ /app/

# # Build the application (skip tests for faster builds)
# #RUN gradle clean --debug build -x test
# RUN gradle clean build -x test

# # Stage 2: Run the application
# FROM openjdk:17

# # Set the working directory inside the container
# WORKDIR /app

# # Copy the built JAR file from the builder stage to the "/app" folder in the final image
# COPY --from=builder /app/build/libs/*.jar app.jar

# # Expose the application port
# EXPOSE 8080

# # Command to run the application
# CMD ["java", "-jar", "app.jar"]

FROM openjdk:17-jdk-alpine
WORKDIR /app
ARG JAR_FILE=app/*.jar
COPY ./app/build/libs/app-0.0.1-SNAPSHOT-plain.jar app.jar
ENTRYPOINT ["java", "jar", "/app.jar"]