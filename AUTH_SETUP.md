# Login y microservicio de autenticación

## Arquitectura

- Frontend: React + Capacitor.
- API: Spring Boot 3.5 con Java 21.
- Seguridad: Spring Security, JWT HS256 y BCrypt.
- Base de datos: PostgreSQL 17.
- Migraciones: Flyway.

## Inicio rápido con Docker

Desde la raíz del proyecto:

```powershell
docker compose up --build
```

La API quedará disponible en `http://localhost:8080`.

Para ejecutar el frontend:

```powershell
Copy-Item .env.example .env
npm run dev
```

Credenciales locales iniciales:

- Usuario: `demo`
- Contraseña: `Bertello2026!`

Estas credenciales son solo para desarrollo. Antes de desplegar, cambia
`JWT_SECRET`, `DB_PASSWORD` y `BOOTSTRAP_USER_PASSWORD`, y desactiva
`BOOTSTRAP_USER_ENABLED`.

## Ejecutar el backend sin Docker

Inicia PostgreSQL y configura las variables `DB_URL`, `DB_USER` y
`DB_PASSWORD`. Después:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
cd auth-service
mvn spring-boot:run
```

## Dispositivos físicos

`localhost` dentro del teléfono apunta al propio teléfono. Para probar desde
Android o iPhone en la misma red, usa la IP LAN de la computadora:

```env
VITE_API_URL=http://192.168.1.100:8080/api
```

Sustituye la IP por la dirección real de la computadora y vuelve a sincronizar
Capacitor:

```powershell
npm run android:sync
npm run ios:sync
```

Para una versión distribuible se recomienda publicar la API detrás de HTTPS y
configurar `VITE_API_URL` con ese dominio.

## Endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /actuator/health`

Ejemplo de login:

```json
{
  "username": "demo",
  "password": "Bertello2026!"
}
```
