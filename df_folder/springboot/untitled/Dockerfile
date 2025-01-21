FROM eclipse-temurin:17
ARG JAR_FILE=build/libs/*.jar
COPY ./build/libs/untitled-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]