# ---------- Stage 1: build del frontend (Angular) ----------
FROM node:20-alpine AS frontend
WORKDIR /frontend

# Con contexto en raíz, copiamos desde ./frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
# Si tu Angular genera a dist/frontend/browser:
RUN npm run build

# ---------- Stage 2: build del backend (Maven) ----------
FROM maven:3.9-eclipse-temurin-21 AS backend-build
# Trabajamos dentro del módulo backend
WORKDIR /workspace/backend/Atech

# Copiamos solo el backend
COPY backend/Atech/ ./

# Copiamos los estáticos generados por Angular al backend
RUN rm -rf src/main/resources/static && mkdir -p src/main/resources/static
# Ajusta la ruta si cambia la salida del build de Angular
COPY --from=frontend /frontend/dist/frontend/browser/ ./src/main/resources/static/

# Compilamos el jar
RUN mvn -q -DskipTests package

# ---------- Stage 3: runtime (JRE liviano) ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copiamos el jar resultante desde el módulo backend
COPY --from=backend-build /workspace/backend/Atech/target/*.jar /app/app.jar

ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_NAME=atechdb
ENV DB_USERNAME=atech
ENV DB_PASSWORD=atechpass

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
