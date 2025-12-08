# ---------- Etapa 1: build del FRONTEND (Angular) ----------
FROM node:20-alpine AS frontend-build

# Trabajamos en /app/frontend
WORKDIR /app/frontend

# Instalar dependencias de Angular
COPY frontend/package*.json ./
RUN npm ci

# Copiar el resto del código del frontend y construir para producción
COPY frontend/ .
RUN npm run build -- --configuration production

# En Angular 17+ con application builder y outputMode=static,
# el build estático suele quedar en dist/frontend/browser
# Si tu salida cambia, solo ajustas esta ruta más abajo.


# ---------- Etapa 2: build del BACKEND (Spring Boot) ----------
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build

WORKDIR /app

# Copiamos el pom y vamos descargando dependencias
COPY backend/Atech/pom.xml backend/Atech/pom.xml
RUN mvn -q -f backend/Atech/pom.xml -DskipTests dependency:go-offline

# Ahora copiamos TODO el código del backend
COPY backend/Atech/ backend/Atech/

# Creamos el directorio de estáticos y copiamos el build de Angular dentro
# para que se empaquete en src/main/resources/static dentro del JAR.
RUN mkdir -p backend/Atech/src/main/resources/static
COPY --from=frontend-build /app/frontend/dist/frontend/browser/ backend/Atech/src/main/resources/static/

# Compilamos el backend (Spring Boot) y generamos el .jar
RUN mvn -q -f backend/Atech/pom.xml -DskipTests package


# ---------- Etapa 3: runtime ----------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseG1GC"

# Copiamos el .jar ya listo con el frontend dentro
COPY --from=backend-build /app/backend/Atech/target/*.jar app.jar

# Spring Boot escucha en 8080
EXPOSE 8080

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
