package com.airline.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({"/login", "/register"})
    public String authPages() {
        return "forward:/index.html";
    }
}
