package com.payflow.account.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * AOP Aspect for logging method execution
 * Demonstrates Spring AOP and Proxy concepts
 */
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    /**
     * Pointcut for all service methods
     */
    @Pointcut("execution(* com.payflow.account.service.*.*(..))")
    public void serviceLayerPointcut() {}

    /**
     * Pointcut for all controller methods
     */
    @Pointcut("execution(* com.payflow.account.controller.*.*(..))")
    public void controllerLayerPointcut() {}

    /**
     * Around advice for logging method execution
     */
    @Around("serviceLayerPointcut() || controllerLayerPointcut()")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        log.info("▶ ENTERING: {}.{}() with args: {}", className, methodName, Arrays.toString(args));
        
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("◀ EXITING: {}.{}() - Duration: {}ms", className, methodName, duration);
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("✖ EXCEPTION in {}.{}() after {}ms: {}", 
                    className, methodName, duration, e.getMessage());
            throw e;
        }
    }
}

