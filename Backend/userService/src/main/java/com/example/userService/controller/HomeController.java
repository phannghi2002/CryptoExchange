package com.example.userService.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/login")
    public String login() {
        return "Custom Login Page";  // Return a custom view if needed
    }

    @GetMapping("/home")
    public String home() {
        return "Welcome, you are logged in!";
    }
}
