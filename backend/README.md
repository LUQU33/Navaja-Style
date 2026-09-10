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

> Nota: la tabla `productos` requiere que exista al menos una categoría en `categorias` para poder crear productos (por la foreign key `categoria_id`). Podés insertar una a mano:
>
> ```sql
> USE NavajaStyle;
> INSERT INTO categorias (nombre) VALUES ('Remeras');
> ```

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

### Crear un producto

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

### Listar todos los productos

- Método: `GET`
- URL: `http://localhost:3000/api/productos`
- Sin body.

### Obtener un producto por id

- Método: `GET`
- URL: `http://localhost:3000/api/productos/1`
- Sin body.

### Actualizar un producto

- Método: `PUT`
- URL: `http://localhost:3000/api/productos/1`
- Body:

```json
{ "precio": 18000 }
```

### Eliminar un producto

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
