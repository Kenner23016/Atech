package com.ADS.Atech.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // no queremos CSRF en API
            .csrf(AbstractHttpConfigurer::disable)
            // CORS básico, lo configuramos default
            .cors(cors -> { })
            // aquí decimos qué es público
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/", "/index.html", "/assets/**").permitAll()
                .anyRequest().permitAll()
            )
            // MUY IMPORTANTE: SIN login por formulario
            .formLogin(AbstractHttpConfigurer::disable)
            // y sin basic, para no meternos con headers
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}
