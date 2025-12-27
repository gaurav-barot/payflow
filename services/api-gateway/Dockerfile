# Build stage - builds from project root context
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy parent pom first
COPY pom.xml ./pom.xml

# Copy all service poms for dependency resolution
COPY services/account-service/pom.xml ./services/account-service/pom.xml
COPY services/transaction-service/pom.xml ./services/transaction-service/pom.xml
COPY services/notification-service/pom.xml ./services/notification-service/pom.xml
COPY services/api-gateway/pom.xml ./services/api-gateway/pom.xml

# Copy api-gateway source
COPY services/api-gateway/src ./services/api-gateway/src

# Build only api-gateway
RUN mvn clean package -DskipTests -pl services/api-gateway -am

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -S payflow && adduser -S payflow -G payflow
USER payflow

# Copy the built jar
COPY --from=build /app/services/api-gateway/target/*.jar app.jar

EXPOSE 8080

# JVM optimization for containers
ENV JAVA_OPTS="-Xms128m -Xmx256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Default to docker profile
ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE -jar app.jar"]
