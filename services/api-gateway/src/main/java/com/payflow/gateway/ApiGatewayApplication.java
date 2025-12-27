package com.payflow.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

/**
 * PayFlow API Gateway
 * Routes incoming requests to appropriate microservices
 * 
 * Configuration:
 * - Local development: Run with --spring.profiles.active=local (default)
 * - Production: Run with --spring.profiles.active=prod
 * 
 * Service URLs are externalized in application-{profile}.yml files
 */
@SpringBootApplication
public class ApiGatewayApplication {

    @Value("${services.account-service.url}")
    private String accountServiceUrl;

    @Value("${services.transaction-service.url}")
    private String transactionServiceUrl;

    @Value("${services.notification-service.url}")
    private String notificationServiceUrl;

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Account Service Routes
                .route("account-service", r -> r
                        .path("/api/accounts/**")
                        .uri(accountServiceUrl))
                
                // Transaction Service Routes
                .route("transaction-service", r -> r
                        .path("/api/transactions/**")
                        .uri(transactionServiceUrl))
                
                // Notification Service Routes
                .route("notification-service", r -> r
                        .path("/api/notifications/**")
                        .uri(notificationServiceUrl))
                
                .build();
    }
}

