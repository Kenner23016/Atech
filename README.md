--------------------------------------------------------------------------------
# Atech – Guía rápida para levantar en local
Guía para levantar **Angular + Spring Boot + PostgreSQL** en local usando **Docker**. No
necesitas tener Java/Node instalados: con Docker basta.
---
## ■ Resumen rápido
- **Frontend (Angular):** <http://localhost:4200>
- **Backend (Spring Boot):** <http://localhost:8080>
- **Base de datos (PostgreSQL):** `localhost:5432`
---
## ■ 1) Requisitos
- **Docker y Docker Compose** instalados
- Windows/Mac: Docker Desktop
- Linux: `docker` + `docker compose` (plugin moderno)
- **Puertos libres:** `4200`, `8080`, `5432`
> Si alguno está ocupado, revisa _Solución de problemas_.
---
## ■■ 2) Archivos importantes del proyecto
- `docker-compose.local.yml` → orquesta **postgres**, **backend** y **frontend** en local.
- `.env.local` → variables de entorno para entorno local (DB, CORS, puertos, etc.).
- `backend/Atech/` → proyecto **Spring Boot** (puerto 8080).
- `frontend/` → proyecto **Angular** (puerto 4200, **proxy** a `/api`).
---
## ■ 3) Primer arranque en local (Docker)
Dentro de la carpeta raíz del proyecto `Atech/`:
### (Opcional) Revisa `.env.local`
```env
# Base de datos
DB_HOST=postgres
DB_NAME=appdb
DB_USER=appuser
DB_PASSWORD=apppass
# Backend
SERVER_PORT=8080
# CORS permitido
CORS_ORIGIN=http://localhost:4200
# Frontend
VITE_API_BASE_URL=http://localhost:8080
```
### Levanta todo con Docker Compose
```bash
docker compose -f docker-compose.local.yml up -d --build
```
Esto:
- Crea un contenedor **PostgreSQL** con datos persistentes en volumen `pgdata`.
- Compila y levanta el **backend (Java 21)** en <http://localhost:8080>.
- Levanta el **frontend (Angular)** en <http://localhost:4200>, con proxy a `/api`.
### Verifica que esté arriba
```bash
docker compose -f docker-compose.local.yml ps
docker compose -f docker-compose.local.yml logs -f
```
Deberías ver **tres servicios**: `postgres`, `backend`, `frontend`.
### Prueba en el navegador
- **Frontend:** <http://localhost:4200>
- **Backend :** <http://localhost:8080> 
> ■ Si Angular no muestra datos, espera a que el backend termine de inicializar o revisa los
logs del backend.
---
## ■■ 4) Comandos útiles
### Ver logs en vivo
```bash
docker compose -f docker-compose.local.yml logs -f backend
docker compose -f docker-compose.local.yml logs -f frontend
docker compose -f docker-compose.local.yml logs -f postgres
```
### Recompilar y reiniciar (cambios en Dockerfiles/Compose)
```bash
docker compose -f docker-compose.local.yml up -d --build
```
### Reiniciar un servicio
```bash
docker compose -f docker-compose.local.yml restart backend
```
### Detener todo
```bash
docker compose -f docker-compose.local.yml down
```
### Detener y borrar también volúmenes (**borra la BD local**)
```bash
docker compose -f docker-compose.local.yml down -v
```
---
## ■ 5) Estructura del proyecto (simplificada)
```text
Atech/
■■ backend/
■ ■■ Atech/ # Proyecto Spring Boot
■ ■■ src/main/java/...
■ ■■ src/main/resources/application.properties
■ ■■ Dockerfile # Imagen backend (multi-stage en algunos casos)
■ ■■ Dockerfile.prod
■■ frontend/ # Proyecto Angular
■ ■■ src/...
■ ■■ angular.json
■ ■■ proxy.conf.json # Proxy /api → backend
■ ■■ Dockerfile.dev # Dev server Angular
■ ■■ Dockerfile.prod # Build + Nginx
■■ docker-compose.local.yml # Orquestación local (recomendado)
■■ .env.local # Variables de entorno locales
■■ .env # Variables (usadas en otros entornos)
■■ .env.prod # Variables para producción
```
---
## ■ 6) ¿Qué hace cada servicio en local?
- **postgres:** base de datos PostgreSQL 16. Guarda datos en volumen `pgdata`.
- **backend:** app Spring Boot en el puerto `8080`. Lee DB de variables (`DB_HOST=postgres`,
etc.). Habilita CORS para `http://localhost:4200`.
- **frontend:** app Angular en el puerto `4200`. Usa `proxy.conf.json` para que `/api` vaya
al **backend**.
---
## ■ 7) Solución de problemas comunes
### El puerto 8080/4200/5432 ya está en uso
**Busca el proceso y ciérralo:**
**Windows (PowerShell):**
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```
**Linux/Mac:**
```bash
lsof -i :8080
kill -9 <PID>
```
O cambia los mapeos de puertos en `docker-compose.local.yml` (por ejemplo `8081:8080`).
### El frontend no “ve” al backend
- Entra a <http://localhost:4200> y confirma backend en <http://localhost:8080>.
- Revisa `frontend/proxy.conf.json`.
- En Docker, los servicios se hablan por nombre: `backend:8080` dentro de la red de Compose.
### Errores de conexión con la BD
- Verifica el contenedor `postgres` y credenciales de `.env.local`.
- Si cambiaste puertos/credenciales, **reinicia**:
```bash
docker compose -f docker-compose.local.yml down -v
docker compose -f docker-compose.local.yml up -d --build
```
---
## ■ 8) Parar y limpiar (local)
- **Parar servicios:**
```bash
docker compose -f docker-compose.local.yml down
```
- **Parar y borrar BD (datos locales):**
```bash
docker compose -f docker-compose.local.yml down -v
```
---
## ■ 9) Contacto / soporte del proyecto
Si algo no arranca, comparte logs de **backend**, **frontend** y **postgres**:
```bash
docker compose -f docker-compose.local.yml logs -f
```
Incluye también tu **sistema operativo** y **versión de Docker**.
Puedes enviar tu problema al correo AtechSoporte@gmail.com _(este es de ejemplo)_
