FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY backend/pom.xml .
COPY backend/src ./src
COPY --from=frontend-build /frontend/dist ./src/main/resources/static
RUN mvn -q clean package -DskipTests -f pom.xml

FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENV JAVA_TOOL_OPTIONS="-Xmx512m -Xms256m"
CMD ["java", "-jar", "app.jar"]
