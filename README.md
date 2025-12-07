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
■ ■■ Atech/                     # Proyecto Spring Boot
■ ■■ src/main/java/...
■ ■■ src/main/resources/application.properties
■ ■■ Dockerfile                 # Imagen backend (multi-stage en algunos casos)
■ ■■ Dockerfile.prod
■■ frontend/                    # Proyecto Angular
■ ■■ src/...
■ ■■ angular.json
■ ■■ proxy.conf.json            # Proxy /api → backend
■ ■■ Dockerfile.dev             # Dev server Angular
■ ■■ Dockerfile.prod            # Build + Nginx
■■ docker-compose.local.yml     # Orquestación local (recomendado)
■■ docker-compose.prod.yml      # Orquestación producción
■■ .env.local                   # Variables de entorno locales
■■ .env                         # Variables (usadas en otros entornos)
■■ .env.prod                    # Variables para producción
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

Puedes enviar tu problema al correo `AtechSoporte@gmail.com` _(este es de ejemplo)_.

---

## ■ 10) Build de imágenes de producción y prueba de entorno “prod” en local

Además del entorno local de desarrollo, el proyecto incluye un flujo para construir imágenes
de producción tanto para el **backend** como para el **frontend** usando Docker.

La idea es:
1. Generar un **tag** (versión) para las imágenes.
2. Construir las imágenes de producción con los Dockerfile específicos.
3. (Opcional) Probar el entorno de producción en tu máquina usando `docker-compose.prod.yml`,
   **sin necesidad de subir nada a Docker Hub**.

### 10.1 Definir el tag de la imagen

```bash
export TAG=$(date +%Y%m%d)
echo "Usando tag: $TAG"
```

Esto generará un tag basado en la fecha actual (por ejemplo `20251205`).

### 10.2 Backend – Imagen de producción (local)

```bash
docker build -t kenner23016/atech-backend:$TAG   -f backend/Atech/Dockerfile.prod ./backend
```

- Usa `Dockerfile.prod` del backend para generar una imagen optimizada para producción.
- La imagen se etiqueta como `kenner23016/atech-backend:$TAG`.

### 10.3 Frontend – Imagen de producción (local)

```bash
docker build -t kenner23016/atech-frontend:$TAG   -f frontend/Dockerfile.prod ./frontend
```

- Usa `Dockerfile.prod` del frontend para generar una imagen lista para servir con Nginx
  (u otro servidor configurado en el Dockerfile).
- La imagen se etiqueta como `kenner23016/atech-frontend:$TAG`.

### 10.4 Probar el entorno de producción en local (sin Docker Hub)

Una vez construidas ambas imágenes de producción **en tu máquina**, puedes levantar el stack
de producción en local utilizando el `docker-compose.prod.yml` :

```bash
docker compose -f docker-compose.prod.yml up -d
```
Validar en el navegador usando `http://localhost:8081` 

Asegúrate de que `docker-compose.prod.yml` esté configurado para usar las imágenes:
- `kenner23016/atech-backend:$TAG`
- `kenner23016/atech-frontend:$TAG`

y que la variable `TAG` esté exportada en tu terminal antes de ejecutar el comando.

Esto levanta un entorno que simula producción (mismos Dockerfile y configuración de
orquestación), pero utilizando las imágenes locales recién construidas.

Para verificar:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

Los servicios deberían estar expuestos en los mismos puertos configurados para producción
(según tu `docker-compose.prod.yml`), normalmente:

- **Frontend (prod):** <http://localhost:80> o el puerto que hayas definido.
- **Backend (prod):** <http://localhost:8080> (o el mapeo que defina tu compose).

---

## ■ 11) Flujo completo de despliegue a producción con Docker Hub

Cuando quieras desplegar la versión estable en un servidor remoto, puedes seguir este flujo:
1. Construir imágenes de producción.
2. Subirlas a Docker Hub.
3. En el servidor, hacer `pull` de las imágenes y levantar `docker-compose.prod.yml`.

### 11.1 Construir y publicar imágenes en Docker Hub

Primero define el tag (por ejemplo, basado en fecha o versión):

```bash
export TAG=$(date +%Y%m%d)
echo "Usando tag: $TAG"
```

#### Backend – build + push

```bash
# Build backend (Spring Boot)
docker build -t kenner23016/atech-backend:$TAG   -f backend/Atech/Dockerfile.prod ./backend

# Subir a Docker Hub
docker push kenner23016/atech-backend:$TAG
```

#### Frontend – build + push

```bash
# Build frontend (Angular + Nginx)
docker build -t kenner23016/atech-frontend:$TAG   -f frontend/Dockerfile.prod ./frontend

# Subir a Docker Hub
docker push kenner23016/atech-frontend:$TAG
```

En este punto, las imágenes de producción quedan disponibles en Docker Hub bajo tu usuario
(`kenner23016`).

### 11.2 Despliegue en el servidor de producción

En el servidor (por ejemplo, una VM en la nube), asegúrate de tener:

- Docker y Docker Compose instalados.
- Archivos `docker-compose.prod.yml` y `.env.prod` (u otras variables necesarias).
- Acceso a Docker Hub con permisos para hacer `pull` de las imágenes.

Luego:

```bash
export TAG=tag_del_dockerhub   # Ejemplo: 20251205
```

```bash
docker pull kenner23016/atech-frontend:$TAG
docker pull kenner23016/atech-backend:$TAG

docker compose -f docker-compose.prod.yml up -d
```

`docker-compose.prod.yml` debe estar configurado para usar las imágenes con ese tag, por
ejemplo:

```yaml
services:
  backend:
    image: kenner23016/atech-backend:${TAG}
    # ...
  frontend:
    image: kenner23016/atech-frontend:${TAG}
    # ...
```

De esta forma:
- Puedes **versionar** claramente cada despliegue usando el valor de `TAG`.
- El servidor solo necesita hacer `pull` de las imágenes ya probadas.
- El mismo archivo `docker-compose.prod.yml` sirve tanto para pruebas de producción en local
  como para el entorno de producción real, cambiando únicamente el valor de `TAG` y las
  variables de entorno.
