# ---- 1단계: Gradle 빌드 ----
    FROM gradle:8.3-jdk17 AS build
    WORKDIR /app
    COPY . . 
    
    # UTF-8 인코딩 강제 설정
    ENV LANG=C.UTF-8
    ENV LC_ALL=C.UTF-8
    
    # Gradle 빌드 시 UTF-8 강제 적용
    RUN echo "tasks.withType(JavaCompile) { options.encoding = 'UTF-8' }" >> build.gradle
    
    RUN gradle clean build -x test  # 여기서 JAR 파일 생성
    
    # ---- 2단계: 실제 런타임 이미지 ----
    FROM openjdk:17-jdk-slim
    WORKDIR /app
    COPY --from=build /app/build/libs/*.jar app.jar
    
    # UTF-8 환경 설정 추가
    ENV LANG=C.UTF-8
    ENV LC_ALL=C.UTF-8
    
    EXPOSE 8080
    ENTRYPOINT ["java", "-jar", "app.jar"]
    