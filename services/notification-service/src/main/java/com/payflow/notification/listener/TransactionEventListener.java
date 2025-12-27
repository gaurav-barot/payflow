package com.payflow.notification.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Kafka listener for transaction events
 * Processes notifications asynchronously
 */
@Component
@Slf4j
public class TransactionEventListener {

    /**
     * Listen for transaction completed events
     */
    @KafkaListener(topics = "transaction-completed", groupId = "notification-service-group")
    @Async("notificationTaskExecutor")
    public void handleTransactionCompleted(Map<String, Object> event) {
        log.info("[NOTIFICATION] Transaction completed - {}", event);
        
        String transactionId = String.valueOf(event.get("transactionId"));
        String fromAccount = String.valueOf(event.get("fromAccount"));
        String toAccount = String.valueOf(event.get("toAccount"));
        Object amount = event.get("amount");

        // In Phase 2, this will send actual email/SMS
        sendNotification(
                "Transaction Successful",
                String.format("Transfer of Rs.%s from %s to %s completed. Transaction ID: %s",
                        amount, fromAccount, toAccount, transactionId)
        );
    }

    /**
     * Listen for account created events
     */
    @KafkaListener(topics = "account-created", groupId = "notification-service-group")
    @Async("notificationTaskExecutor")
    public void handleAccountCreated(Map<String, Object> event) {
        log.info("[NOTIFICATION] Account created - {}", event);
        
        String accountNumber = String.valueOf(event.get("accountNumber"));
        String holderName = String.valueOf(event.get("holderName"));

        sendNotification(
                "Welcome to PayFlow!",
                String.format("Hello %s! Your account %s has been created successfully.",
                        holderName, accountNumber)
        );
    }

    /**
     * Listen for transaction failed events
     */
    @KafkaListener(topics = "transaction-failed", groupId = "notification-service-group")
    @Async("notificationTaskExecutor")
    public void handleTransactionFailed(Map<String, Object> event) {
        log.warn("[NOTIFICATION] Transaction failed - {}", event);
        
        String transactionId = String.valueOf(event.get("transactionId"));
        String reason = String.valueOf(event.get("reason"));

        sendNotification(
                "Transaction Failed",
                String.format("Transaction %s failed. Reason: %s", transactionId, reason)
        );
    }

    /**
     * Send notification (logs for now, email/SMS in Phase 2)
     */
    private void sendNotification(String subject, String message) {
        log.info("================================================================");
        log.info("                    [NOTIFICATION]                              ");
        log.info("================================================================");
        log.info("| Subject: {}", subject);
        log.info("| Message: {}", message);
        log.info("================================================================");
        
        // TODO: Phase 2 - Integrate with email service (SendGrid/SMTP)
        // TODO: Phase 2 - Integrate with SMS service (Twilio/AWS SNS)
    }
}

