package com.ADS.Atech.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

      /*   http
            // es demo -> sin CSRF
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                // ====== PÚBLICO ======
                .requestMatchers("/", "/index.html", "/assets/**", "/favicon.ico", "/error").permitAll()

                // ====== MARKETPLACE PÚBLICO ======
                // tu marketplace usa GET /api/products -> lo dejamos libre
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                // este lo vamos a usar desde Angular para saber si ya hay sesión
                .requestMatchers("/api/auth/me").authenticated()

                // ====== TODO LO DEMÁS: LOGIN ======
                .anyRequest().authenticated()
            )
            // login por defecto de spring
            .formLogin(form -> form
                .permitAll()
                // 👇👇 AQUÍ EL CAMBIO: después de loguear, mándame al frontend
                .defaultSuccessUrl("http://localhost:4200/", true)
            )
            // por si quieres probar con postman
            .httpBasic(Customizer.withDefaults())
            // si la llamada vino de /api/** y no estás logueado -> 401 (no HTML)
            .exceptionHandling(ex -> ex
                .defaultAuthenticationEntryPointFor(
                    new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    new AntPathRequestMatcher("/api/**")
                )
            );
*/

http
    .csrf(AbstractHttpConfigurer::disable)
    .cors(Customizer.withDefaults())
    .authorizeHttpRequests(auth -> auth
        // Público del frontend (irrelevante si sirves Angular con Nginx, pero no estorba)
        .requestMatchers("/", "/index.html", "/assets/**", "/favicon.ico", "/error").permitAll()

        // Público en tu API
        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

        // Requiere sesión si existiera; si no hay, devolverá 401 (no redirección)
        .requestMatchers("/api/auth/me").authenticated()

        // Todo lo demás protegido
        .anyRequest().authenticated()
    )
    // 🔴 Desactiva el login HTML de Spring
    .formLogin(AbstractHttpConfigurer::disable)

    // (Opcional) Deja BASIC para probar con Postman
    .httpBasic(Customizer.withDefaults())

    // Si pegan a /api/** sin estar logueados -> 401
    .exceptionHandling(ex -> ex
        .defaultAuthenticationEntryPointFor(
            new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
            new AntPathRequestMatcher("/api/**")
        )
    );

        return http.build();
    }

    // CORS para poder llamar desde http://localhost:4200
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(
                "http://localhost:4200",
                "http://127.0.0.1:4200"
        ));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    } 



}



