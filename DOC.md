# BookNest — Aplicació full-stack Node.js + Vue 3

## 1. Arquitectura
Aplicació client-servidor:
- **Frontend (Vue 3 SPA)**: aplicació de pàgina única amb rutes (vue-router). Fa peticions HTTP a una API REST.
- **Backend (Node.js + Express)**: exposa endpoints REST, aplica autenticació amb JWT.
- **Base de dades (SQLite + Prisma)**: persistència d’usuaris i del recurs principal.

## 2. Recurs principal
Recurs: **Books (llibres)**  
Operacions CRUD:
- Crear llibre
- Consultar llistat / un llibre
- Modificar llibre
- Eliminar llibre

Cada llibre està associat a l’usuari autenticat (userId) i un usuari només veu els seus llibres.

## 3. Endpoints
### Auth
- `POST /register` (public): crea un usuari (email + password hash) i retorna token.
- `POST /login` (public): valida credencials i retorna token.

### Books (protegits amb JWT)
- `GET /books`: llista llibres de l’usuari.
- `GET /books/:id`: obté un llibre de l’usuari.
- `POST /books`: crea un llibre per l’usuari.
- `PUT /books/:id`: edita un llibre de l’usuari.
- `DELETE /books/:id`: elimina un llibre de l’usuari.

## 4. Flux d’autenticació (JWT)
1) L’usuari es registra o fa login.
2) El backend retorna un **JWT**.
3) El frontend guarda el token (localStorage).
4) Per accedir al CRUD, el frontend envia:
   `Authorization: Bearer <token>`
5) El backend valida el token amb un middleware i permet l’accés.
