package com.payflow.notification.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * REST Controller for Notification Service health and info
 */
@RestController
@RequestMapping("/api/notifications")
@Slf4j
public class NotificationController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "notification-service",
                "status", "UP",
                "message", "Notification service is running and listening to Kafka events"
        ));
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        return ResponseEntity.ok(Map.of(
                "service", "notification-service",
                "version", "1.0.0",
                "topics", new String[]{"transaction-completed", "account-created", "transaction-failed"},
                "capabilities", Map.of(
                        "email", "Coming in Phase 2",
                        "sms", "Coming in Phase 2",
                        "push", "Coming in Phase 3"
                )
        ));
    }
}

