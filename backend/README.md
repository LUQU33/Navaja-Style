# NavajaStyle - Backend

API REST para el CRUD de productos de NavajaStyle, construida con Express y MySQL.

## Requisitos

- Node.js
- pnpm
- MySQL corriendo localmente

## 1. Instalar dependencias

```bash
pnpm install
```

## 2. Crear la base de datos

Ejecutar el script de `sql/schema.sql` contra tu servidor MySQL. Por ejemplo, desde la terminal:

```bash
mysql -u root -p < sql/schema.sql
```

Esto crea la base `NavajaStyle` con todas sus tablas (el script ya incluye `CREATE DATABASE`).

> Nota: la tabla `productos` requiere que exista al menos una categoría en `categorias` para poder crear productos (por la foreign key `categoria_id`). Podés insertarla a mano con SQL, o crearla desde la API con el endpoint `POST /api/categorias` (ver más abajo).

## 3. Configurar variables de entorno

Copiar `.env.example` a `.env` y completar con tus datos de conexión a MySQL:

```bash
cp .env.example .env
```

```
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=NavajaStyle
```

## 4. Levantar el servidor

```bash
pnpm dev
```

El servidor queda escuchando en `http://localhost:3000`. Todas las rutas de la API están montadas bajo el prefijo `/api`.

## 5. Probar los endpoints con Postman

Para cada request: elegir el método, poner la URL, y si hay body, en la pestaña **Body** elegir **raw** + **JSON**.

### Categorías

#### Crear una categoría

- Método: `POST`
- URL: `http://localhost:3000/api/categorias`
- Body:

```json
{ "nombre": "Remeras" }
```

#### Listar todas las categorías

- Método: `GET`
- URL: `http://localhost:3000/api/categorias`
- Sin body.

#### Obtener una categoría por id

- Método: `GET`
- URL: `http://localhost:3000/api/categorias/1`
- Sin body.

#### Actualizar una categoría

- Método: `PUT`
- URL: `http://localhost:3000/api/categorias/1`
- Body:

```json
{ "nombre": "Camperas" }
```

#### Eliminar una categoría

- Método: `DELETE`
- URL: `http://localhost:3000/api/categorias`
- Body:

```json
{ "id": 1 }
```

### Productos

#### Crear un producto

- Método: `POST`
- URL: `http://localhost:3000/api/productos`
- Body:

```json
{
  "nombre": "Remera básica",
  "descripcion": "Remera de algodón",
  "precio": 15000,
  "categoria_id": 1
}
```

#### Listar todos los productos

- Método: `GET`
- URL: `http://localhost:3000/api/productos`
- Sin body.

#### Obtener un producto por id

- Método: `GET`
- URL: `http://localhost:3000/api/productos/1`
- Sin body.

#### Actualizar un producto

- Método: `PUT`
- URL: `http://localhost:3000/api/productos/1`
- Body:

```json
{ "precio": 18000 }
```

#### Eliminar un producto

- Método: `DELETE`
- URL: `http://localhost:3000/api/productos`
- Body:

```json
{ "id": 1 }
```

## Respuestas de error

Si algo sale mal, la API responde con el status HTTP correspondiente y un body tipo:

```json
{ "error": "Producto con id 99 no encontrado" }
```

---

## Autenticación de usuarios

Se agregó autenticación de usuarios al backend utilizando Express, MySQL y el módulo nativo `crypto` de Node.js.

Actualmente incluye:

- búsqueda de usuarios por email;
- hash y verificación de contraseñas;
- login;
- generación de token;
- validación de token;
- middleware de autenticación;
- ruta protegida para obtener el usuario autenticado.

### Variables de entorno

Además de las variables de conexión a MySQL, agregar en `.env`:

```env
AUTH_SECRET=TU_CLAVE_SECRETA
```

Podés generar una clave aleatoria con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

El archivo `.env` no debe subirse al repositorio.

En `.env.example` se puede dejar:

```env
AUTH_SECRET=
```

para indicar que cada desarrollador debe configurar su propia clave.

### Login

#### Iniciar sesión

- Método: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Body:

```json
{
  "email": "prueba@gmail.com",
  "password": "123456"
}
```

Si las credenciales son correctas, responde:

```json
{
  "mensaje": "Login correcto",
  "token": "TOKEN_GENERADO",
  "usuario": {
    "id": 1,
    "nombre": "Usuario",
    "apellido": "Prueba",
    "email": "prueba@gmail.com",
    "rol": "cliente"
  }
}
```

El campo `password_hash` no se devuelve en la respuesta.

#### Campos obligatorios vacíos

Si falta el email o la contraseña:

```json
{
  "email": "",
  "password": ""
}
```

La API responde:

```text
400 Bad Request
```

```json
{
  "error": "Email y contraseña son obligatorios"
}
```

#### Usuario inexistente

```json
{
  "email": "noexiste@gmail.com",
  "password": "123456"
}
```

La API responde:

```text
401 Unauthorized
```

```json
{
  "error": "Email o contraseña incorrectos"
}
```

#### Contraseña incorrecta

```json
{
  "email": "prueba@gmail.com",
  "password": "incorrecta"
}
```

La API responde:

```text
401 Unauthorized
```

```json
{
  "error": "Email o contraseña incorrectos"
}
```

### Hash de contraseñas

Las contraseñas no se guardan en texto plano.

Se utiliza el módulo nativo de Node.js:

```js
const crypto = require("crypto");
```

El hash se genera utilizando:

```js
crypto.scrypt()
```

También se genera un `salt` aleatorio.

El formato guardado en la base de datos es:

```text
salt:hash
```

Para verificar una contraseña se vuelve a calcular el hash utilizando el salt guardado y se compara mediante:

```js
crypto.timingSafeEqual()
```

### Token de autenticación

Cuando el login es correcto se genera un token firmado utilizando:

```js
crypto.createHmac("sha256", AUTH_SECRET)
```

El token contiene información básica del usuario:

```json
{
  "id": 1,
  "email": "prueba@gmail.com",
  "rol": "cliente",
  "exp": 1789257841
}
```

El formato utilizado es:

```text
payload.firma
```

El payload se codifica utilizando `base64url`.

Actualmente el token tiene una duración de una hora.

### Validación del token

La función `verificarToken(token)`:

1. separa el payload y la firma;
2. genera nuevamente la firma con `AUTH_SECRET`;
3. compara ambas firmas;
4. decodifica el payload;
5. verifica la fecha de vencimiento;
6. devuelve el payload si el token es válido, o `null` si es inválido.

### Middleware de autenticación

El archivo:

```text
src/middlewares/auth.middleware.js
```

permite proteger rutas que requieren un usuario autenticado.

El cliente debe enviar el token mediante el header:

```http
Authorization: Bearer TOKEN
```

El middleware:

```text
lee Authorization
        ↓
verifica formato Bearer
        ↓
extrae token
        ↓
verifica token
        ↓
guarda payload en req.usuario
        ↓
continúa con next()
```

Cuando el token es válido:

```js
req.usuario = payload;
```

De esta forma, las rutas protegidas pueden acceder a los datos del usuario autenticado.

### Usuario autenticado

#### Obtener usuario autenticado

- Método: `GET`
- URL: `http://localhost:3000/api/auth/me`
- Header:

```http
Authorization: Bearer TOKEN
```

Si el token es válido, responde:

```json
{
  "usuario": {
    "id": 1,
    "email": "prueba@gmail.com",
    "rol": "cliente",
    "exp": 1789257841
  }
}
```

#### Sin token

Si no se envía el header `Authorization`:

```text
401 Unauthorized
```

```json
{
  "error": "Token no enviado"
}
```

#### Token inválido

Si se envía un token incorrecto:

```http
Authorization: Bearer token-falso
```

la API responde:

```text
401 Unauthorized
```

```json
{
  "error": "Token invalido o vencido"
}
```

### Probar autenticación desde VS Code

Se agregó el archivo:

```text
api-test.http
```

Este archivo permite probar los endpoints directamente desde VS Code.

Ejemplo:

```http
@url=http://localhost:3000/api

### Login correcto
POST {{url}}/auth/login
Content-Type: application/json

{
  "email": "prueba@gmail.com",
  "password": "123456"
}

### Contraseña incorrecta
POST {{url}}/auth/login
Content-Type: application/json

{
  "email": "prueba@gmail.com",
  "password": "incorrecta"
}

### Usuario inexistente
POST {{url}}/auth/login
Content-Type: application/json

{
  "email": "noexiste@gmail.com",
  "password": "123456"
}

### Campos obligatorios vacíos
POST {{url}}/auth/login
Content-Type: application/json

{
  "email": "",
  "password": ""
}

### Sin token
GET {{url}}/auth/me

### Token inválido
GET {{url}}/auth/me
Authorization: Bearer token-falso

### Token válido
GET {{url}}/auth/me
Authorization: Bearer TOKEN
```

Para probar el token válido:

1. ejecutar primero el login correcto;
2. copiar el valor de `token` de la respuesta;
3. pegarlo después de `Bearer`;
4. ejecutar `GET /api/auth/me`.

### Flujo de autenticación

```text
POST /api/auth/login
        ↓
email + contraseña
        ↓
buscar usuario en MySQL
        ↓
verificar contraseña
        ↓
generar token
        ↓
devolver token
        ↓
GET /api/auth/me
        ↓
Authorization: Bearer TOKEN
        ↓
middleware verifica token
        ↓
req.usuario
        ↓
acceso permitido
```
