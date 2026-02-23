# CEREBRO – Módulo de Torneos
### Documentación Backend (MVP v1)

---

## Overview

El módulo de Torneos está desarrollado con **NestJS** y se integra directamente con la API de **ROBLE** para autenticación y operaciones de base de datos.

Este módulo proporciona la infraestructura para competencias organizadas dentro de la plataforma CEREBRO, inicialmente para el juego **Sudoku**, pero con arquitectura preparada para futuros juegos.

El módulo gestiona:
- Creación de torneos
- Gestión de participantes
- Registro de resultados
- Generación de ranking dinámico
- Transiciones automáticas de estado
- Integración futura con Track y PVP

> El backend no mantiene base de datos propia. Toda la persistencia es delegada a **ROBLE** (Database as a Service).

---

## Arquitectura
```
Usuario
 → API Torneos (NestJS)
     → ROBLE Auth API
     → ROBLE Database API
```

El módulo actúa como una capa de lógica de negocio y orquestación sobre los servicios de ROBLE.

---

## Stack Tecnológico

| Área | Tecnología |
|---|---|
| Framework | NestJS |
| Lenguaje | TypeScript |
| Base de datos | ROBLE (DBaaS) |
| Autenticación | JWT (ROBLE) |
| Cliente HTTP | Axios (HttpModule) |
| Testing | Jest + Supertest |
| Documentación | Swagger |
| Contenerización | Docker |

---

## Estructura de Módulos
```
AppModule
 ├── AuthModule
 ├── TorneosModule
 ├── RobleModule
 └── Common (Guards / Types)
```

---

## Modelo de Datos (ROBLE)

### Tabla: `torneos`

| Campo | Descripción |
|---|---|
| `_id` | Identificador único |
| `nombre` | Nombre del torneo |
| `descripcion` | Descripción |
| `creadorId` | ID del usuario creador |
| `codigoAcceso` | Código para torneos privados |
| `esPublico` | Boolean |
| `estado` | Estado actual |
| `tipo` | `puntos` \| `tiempo` \| `pvp` |
| `fechaInicio` | Fecha de inicio |
| `fechaFin` | Fecha de fin |
| `recurrencia` | `NINGUNA` \| `SEMANAL` \| `MENSUAL` |
| `configuracion` | JSON de configuración |
| `fechaCreacion` | Timestamp de creación |

### Tabla: `participantes`

| Campo | Descripción |
|---|---|
| `_id` | Identificador único |
| `torneoId` | Referencia al torneo |
| `usuarioId` | Referencia al usuario |
| `fechaUnion` | Timestamp de unión |

> **Regla:** Un usuario no puede unirse dos veces al mismo torneo.

### Tabla: `resultados`

| Campo | Descripción |
|---|---|
| `_id` | Identificador único |
| `torneoId` | Referencia al torneo |
| `usuarioId` | Referencia al usuario |
| `puntaje` | Puntaje obtenido |
| `tiempo` | Tiempo registrado |
| `fechaRegistro` | Timestamp del resultado |

> **Regla:** Solo se conserva el mejor resultado por usuario.

---

## Estados del Torneo
```
BORRADOR → PROGRAMADO → ACTIVO → FINALIZADO
                      ↘ PAUSADO
                      ↘ CANCELADO
```

| Estado | Descripción |
|---|---|
| `BORRADOR` | Recién creado |
| `PROGRAMADO` | Configurado, aún no iniciado |
| `ACTIVO` | En curso |
| `PAUSADO` | Temporalmente detenido |
| `FINALIZADO` | Concluido |
| `CANCELADO` | Cancelado |

### Transición Automática

- Si `fechaInicio ≤ ahora ≤ fechaFin` → **ACTIVO**
- Si `ahora > fechaFin` → **FINALIZADO**

La validación del estado se ejecuta cuando el torneo es consultado o interactuado.

---

## Reglas de Negocio

### Creación
- Cualquier usuario autenticado puede crear torneos.
- Estado inicial: `BORRADOR`.
- Si el torneo es privado, se genera automáticamente un código de acceso de **6 caracteres**.

### Participación
- Solo usuarios autenticados.
- No se puede unir dos veces.
- No se puede unir si el torneo está `FINALIZADO` o `CANCELADO`.

### Resultados
- Solo participantes pueden enviar resultados.
- Solo si el torneo está `ACTIVO`.
- Se guarda únicamente el mejor puntaje por usuario.

**Criterios de desempate:**
1. Puntaje `DESC`
2. Tiempo `ASC`
3. FechaRegistro `ASC`

---

## Sistema de Ranking

El ranking se genera **dinámicamente** al ser consultado. No existe tabla persistente de ranking.

**Ordenamiento:**
1. Mayor puntaje primero
2. Menor tiempo primero
3. Registro más antiguo primero

---

## Recurrencia

| Valor | Descripción |
|---|---|
| `NINGUNA` | Sin recurrencia |
| `SEMANAL` | Recurrencia semanal |
| `MENSUAL` | Recurrencia mensual |

> En esta versión MVP solo se almacena el valor. La automatización de nuevas instancias está planificada para **v2**.

---

## Autenticación y Seguridad

- JWT emitido por ROBLE.
- Todos los endpoints protegidos requieren token `Bearer`.
- Validación del token mediante proxy hacia ROBLE.
- Implementación de `RobleAuthGuard`.
- No se almacenan credenciales localmente.

---

## Endpoints

**Base:** `/api/v1`

### Autenticación _(Proxy hacia ROBLE)_

| Método | Ruta |
|---|---|
| `POST` | `/auth/login` |
| `POST` | `/auth/refresh` |
| `POST` | `/auth/signup` |
| `POST` | `/auth/logout` |
| `GET` | `/auth/verify-token` |

### Torneos

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/torneos` | Crear torneo |
| `GET` | `/torneos` | Listar torneos |
| `GET` | `/torneos/:id` | Obtener torneo |
| `PUT` | `/torneos/:id` | Actualizar torneo |
| `PATCH` | `/torneos/:id/estado` | Cambiar estado |
| `DELETE` | `/torneos/:id` | Eliminar torneo |
| `POST` | `/torneos/:id/unirse` | Unirse a torneo |
| `POST` | `/torneos/:id/resultados` | Enviar resultado |
| `GET` | `/torneos/:id/ranking` | Ver ranking |
| `GET` | `/torneos/usuarios/:usuarioId/resultados` | Resultados por usuario |

---

## Testing

Implementado con **Jest** (unitarias) y **Supertest** (e2e).

Escenarios cubiertos:
- Login válido
- Creación de torneo
- Prevención de unión duplicada
- Envío de resultado sin participación
- Validación correcta de ranking
- Transición automática de estado

---

## Swagger

Disponible en: `http://localhost:3000/api`

Documenta DTOs, esquemas de request/response y autenticación Bearer.

---

## Despliegue

- Dockerizado con multi-stage build
- Puerto: **3000**

**Variables de entorno requeridas:**
```env
ROBLE_AUTH_BASE=
ROBLE_DB_BASE=
ROBLE_DBNAME=
```

---

## Limitaciones del MVP

- No incluye frontend
- Recurrencia no automatizada
- No valida internamente la lógica de Sudoku
- Dependencia total de disponibilidad de ROBLE
- No implementa cache para ranking

---

## Escalabilidad

- Arquitectura independiente del juego
- Estructura modular
- Preparado para nuevos juegos
- Preparado para automatización futura de recurrencia
- Posibilidad de cambiar proveedor de base de datos sin modificar lógica de negocio

---

## Conclusión Técnica

El módulo de Torneos implementa una infraestructura competitiva desacoplada, validada mediante pruebas automatizadas e integrada con ROBLE como proveedor externo de autenticación y base de datos. Su diseño modular y escalable permite futura expansión dentro del ecosistema CEREBRO sin generar acoplamientos rígidos.
