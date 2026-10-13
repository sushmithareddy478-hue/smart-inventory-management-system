package com.inventorypro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class InventoryProApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryProApplication.class, args);
    }
}
