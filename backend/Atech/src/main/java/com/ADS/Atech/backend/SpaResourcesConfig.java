package com.ADS.Atech.backend;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class SpaResourcesConfig implements WebMvcConfigurer {

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry
      // OJO: usar "/**" (NO "/**/*")
      .addResourceHandler("/**")
      .addResourceLocations("classpath:/static/")
      .resourceChain(true)
      .addResolver(new PathResourceResolver() {
        @Override
        protected Resource getResource(String resourcePath, Resource location) throws IOException {
          // 1) Si el recurso estático existe (js, css, img...), servirlo
          Resource requested = location.createRelative(resourcePath);
          if (requested.exists() && requested.isReadable()) {
            return requested;
          }

          // 2) Si NO existe y NO es /api/* y NO parece un archivo (no tiene punto),
          //    devolver index.html (fallback SPA)
          if (!resourcePath.startsWith("api") && !resourcePath.contains(".")) {
            return new ClassPathResource("/static/index.html");
          }

          // 3) Para /api/* u otros no encontrados, dejar que lo manejen otros mappings/404
          return null;
        }
      });
  }
}


