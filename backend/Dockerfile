FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENV JAVA_TOOL_OPTIONS="-Xmx512m -Xms256m"
CMD ["java", "-jar", "app.jar"]
