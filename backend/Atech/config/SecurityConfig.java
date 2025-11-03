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
            // 1. Deshabilita CSRF, ya que no se usa con APIs REST
            .csrf(AbstractHttpConfigurer::disable)
            
            .authorizeHttpRequests(authorize -> authorize
                // 2. Permite explícitamente TODAS las solicitudes a tu API de productos
                .requestMatchers("/api/products/**").permitAll() 
                
                // 3. (Opcional) Puedes requerir autenticación para otras rutas
                // .requestMatchers("/api/admin/**").authenticated() 
                
                // 4. Permite cualquier otra solicitud (para no bloquear nada más por ahora)
                .anyRequest().permitAll() 
            );

        return http.build();
    }
}