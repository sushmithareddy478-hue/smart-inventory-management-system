# Stage 1: Build application with Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build project package
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Lightweight runtime environment
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install curl for container health check
RUN apk --no-cache add curl && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy executable jar from builder
COPY --from=builder /app/target/inventory-pro-backend-*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
