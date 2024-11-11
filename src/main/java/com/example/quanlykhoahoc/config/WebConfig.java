package com.example.quanlykhoahoc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Kích hoạt cho tất cả các endpoint hoặc các endpoint cụ thể
                .allowedOrigins("http://localhost:63342") // Cho phép yêu cầu từ nguồn này
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Cho phép các phương thức HTTP cụ thể
                .allowedHeaders("*") // Cho phép tất cả các header
                .allowCredentials(true); // Tuỳ chọn: nếu bạn cần gửi cookies hoặc thông tin xác thực
    }
}