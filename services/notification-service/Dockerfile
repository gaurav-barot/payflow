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

# Copy notification-service source
COPY services/notification-service/src ./services/notification-service/src

# Build only notification-service
RUN mvn clean package -DskipTests -pl services/notification-service -am

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -S payflow && adduser -S payflow -G payflow
USER payflow

# Copy the built jar
COPY --from=build /app/services/notification-service/target/*.jar app.jar

EXPOSE 8083

# JVM optimization for containers
ENV JAVA_OPTS="-Xms64m -Xmx128m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
