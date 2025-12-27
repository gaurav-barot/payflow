package com.payflow.account.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Kafka configuration and topic creation
 */
@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic accountCreatedTopic() {
        return TopicBuilder.name("account-created")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic debitCompletedTopic() {
        return TopicBuilder.name("debit-completed")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic creditCompletedTopic() {
        return TopicBuilder.name("credit-completed")
                .partitions(1)
                .replicas(1)
                .build();
    }
}

