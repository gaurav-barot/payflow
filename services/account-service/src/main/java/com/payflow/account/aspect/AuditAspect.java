package com.payflow.account.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * AOP Aspect for auditing important operations
 * Tracks who did what and when
 */
@Aspect
@Component
@Slf4j
public class AuditAspect {

    /**
     * Pointcut for account creation
     */
    @Pointcut("execution(* com.payflow.account.service.AccountService.createAccount(..))")
    public void accountCreation() {}

    /**
     * Pointcut for balance updates
     */
    @Pointcut("execution(* com.payflow.account.service.AccountService.updateBalance(..))")
    public void balanceUpdate() {}

    /**
     * Audit account creation
     */
    @AfterReturning(pointcut = "accountCreation()", returning = "result")
    public void auditAccountCreation(JoinPoint joinPoint, Object result) {
        log.info("📋 AUDIT | Operation: ACCOUNT_CREATED | Time: {} | Result: {}", 
                LocalDateTime.now(), result);
    }

    /**
     * Audit balance updates (debits and credits)
     */
    @AfterReturning(pointcut = "balanceUpdate()", returning = "result")
    public void auditBalanceUpdate(JoinPoint joinPoint, Object result) {
        Object[] args = joinPoint.getArgs();
        log.info("📋 AUDIT | Operation: BALANCE_UPDATED | Time: {} | Request: {} | Result: {}", 
                LocalDateTime.now(), args[0], result);
    }
}

