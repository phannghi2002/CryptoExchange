package com.example.sharedLibrary;


import lombok.Getter;

import java.util.Map;

@Getter
public enum EmailTemplate {
    FORGOT_PASSWORD("FORGOT_PASSWORD", "Reset Your Password",
            "<html><body><h1>Reset Your Password</h1><p>Your reset code is <b>{code}</b></p></body></html>"),
    WELCOME_EMAIL("WELCOME_EMAIL", "Welcome to Trading Platform",
            "<html><body><h1>Welcome!</h1><p>Hello, {name}! We're excited to have you on our platform.</p></body></html>"),
    TWO_FACTOR_AUTH("TWO_FACTOR_AUTH", "Two-Factor Authentication",
            "<html><body><h1>Authentication Code</h1><p>Your authentication code is <b>{code}</b></p></body></html>"),
    REGISTER_OTP("REGISTER_OTP", "Verify Your Email",
                         "<html><body><h1>Verify Your Email</h1><p>Your OTP code is <b>{code}</b></p></body></html>");
    private final String code;
    private final String subjectTemplate;
    private final String bodyTemplate;

    EmailTemplate(String code, String subjectTemplate, String bodyTemplate) {
        this.code = code;
        this.subjectTemplate = subjectTemplate;
        this.bodyTemplate = bodyTemplate;
    }

    public String generateSubject(Map<String, Object> params) {
        // Nếu cần xử lý tham số trong subject
        return subjectTemplate;
    }

    public String generateBody(Map<String, Object> params) {
        String body = bodyTemplate;
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            body = body.replace("{" + entry.getKey() + "}", entry.getValue().toString());
        }
        return body;
    }
}
