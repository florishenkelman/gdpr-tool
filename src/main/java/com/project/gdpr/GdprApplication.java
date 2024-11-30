package com.project.gdpr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.project.gdpr.repository")
@EntityScan(basePackages = "com.project.gdpr.entity")
public class GdprApplication {

    public static void main(String[] args) {
        SpringApplication.run(GdprApplication.class, args);
    }

}
