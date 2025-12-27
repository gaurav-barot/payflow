package com.payflow.account.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Configuration for async operations using ThreadPoolExecutor
 * Demonstrates multi-threading in Spring Boot
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * Thread pool for account operations
     */
    @Bean(name = "accountTaskExecutor")
    public Executor accountTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);      // Minimum threads
        executor.setMaxPoolSize(10);      // Maximum threads
        executor.setQueueCapacity(25);    // Queue size before creating new threads
        executor.setThreadNamePrefix("ACCOUNT-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.initialize();
        return executor;
    }

    /**
     * Thread pool for Kafka operations
     */
    @Bean(name = "kafkaTaskExecutor")
    public Executor kafkaTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("KAFKA-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.initialize();
        return executor;
    }
}

