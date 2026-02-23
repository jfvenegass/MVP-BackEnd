CEREBRO – Módulo de Torneos
Documentación Backend (MVP v1)
________________________________________
Overview
El módulo de Torneos está desarrollado con NestJS y se integra directamente con la API de ROBLE para autenticación y operaciones de base de datos.
Este módulo proporciona la infraestructura para competencias organizadas dentro de la plataforma CEREBRO, inicialmente para el juego Sudoku, pero con arquitectura preparada para futuros juegos.
El módulo gestiona:
•	Creación de torneos
•	Gestión de participantes
•	Registro de resultados
•	Generación de ranking dinámico
•	Transiciones automáticas de estado
•	Integración futura con Track y PVP
El backend no mantiene base de datos propia.
Toda la persistencia es delegada a ROBLE (Database as a Service).
________________________________________
Arquitectura
Usuario
 → API Torneos (NestJS)
     → ROBLE Auth API
     → ROBLE Database API
El módulo actúa como una capa de lógica de negocio y orquestación sobre los servicios de ROBLE.
________________________________________
Stack Tecnológico
•	Framework: NestJS
•	Lenguaje: TypeScript
•	Base de datos: ROBLE (DBaaS)
•	Autenticación: JWT (ROBLE)
•	Cliente HTTP: Axios (HttpModule)
•	Testing: Jest + Supertest
•	Documentación: Swagger
•	Contenerización: Docker
________________________________________
Estructura de Módulos
AppModule
 ├── AuthModule
 ├── TorneosModule
 ├── RobleModule
 └── Common (Guards / Types)
________________________________________
Modelo de Datos (ROBLE)
Tabla: torneos
Campos:
•	_id
•	nombre
•	descripcion
•	creadorId
•	codigoAcceso
•	esPublico
•	estado
•	tipo (puntos | tiempo | pvp)
•	fechaInicio
•	fechaFin
•	recurrencia (NINGUNA | SEMANAL | MENSUAL)
•	configuracion (JSON)
•	fechaCreacion
________________________________________
Tabla: participantes
•	_id
•	torneoId
•	usuarioId
•	fechaUnion
Regla:
Un usuario no puede unirse dos veces al mismo torneo.
________________________________________
Tabla: resultados
•	_id
•	torneoId
•	usuarioId
•	puntaje
•	tiempo
•	fechaRegistro
Regla:
Solo se conserva el mejor resultado por usuario.
________________________________________
Estados Oficiales del Torneo
•	BORRADOR
•	PROGRAMADO
•	ACTIVO
•	PAUSADO
•	FINALIZADO
•	CANCELADO
Transición Automática
Si:
•	fechaInicio ≤ ahora ≤ fechaFin → ACTIVO
•	ahora > fechaFin → FINALIZADO
La validación del estado se ejecuta cuando el torneo es consultado o interactuado.
________________________________________
⚙️ Reglas de Negocio
Creación
•	Cualquier usuario autenticado puede crear torneos.
•	Estado inicial: BORRADOR.
•	Si el torneo es privado, se genera automáticamente un código de acceso de 6 caracteres.
________________________________________
Participación
•	Solo usuarios autenticados.
•	No se puede unir dos veces.
•	No se puede unir si el torneo está FINALIZADO o CANCELADO.
________________________________________
Resultados
•	Solo participantes pueden enviar resultados.
•	Solo si el torneo está ACTIVO.
•	Se guarda únicamente el mejor puntaje por usuario.
Criterios de desempate
1.	Puntaje DESC
2.	Tiempo ASC
3.	FechaRegistro ASC
________________________________________
Sistema de Ranking
El ranking se genera dinámicamente al ser consultado.
Ordenamiento:
•	Mayor puntaje primero
•	Menor tiempo primero
•	Registro más antiguo primero
No existe tabla persistente de ranking.
________________________________________
Recurrencia
Valores permitidos:
•	NINGUNA
•	SEMANAL
•	MENSUAL
En esta versión MVP:
•	Solo se almacena el valor.
•	No se automatiza la creación de nuevas instancias.
•	Se deja preparado para implementación futura (v2).
________________________________________
Autenticación y Seguridad
•	JWT emitido por ROBLE.
•	Todos los endpoints protegidos requieren token Bearer.
•	Validación del token mediante proxy hacia ROBLE.
•	Implementación de RobleAuthGuard.
•	No se almacenan credenciales localmente.
________________________________________
Endpoints
Base:
/api/v1
Autenticación (Proxy hacia ROBLE)
•	POST /auth/login
•	POST /auth/refresh
•	POST /auth/signup
•	POST /auth/logout
•	GET /auth/verify-token
________________________________________
Torneos
•	POST /torneos
•	GET /torneos
•	GET /torneos/:id
•	PUT /torneos/:id
•	PATCH /torneos/:id/estado
•	DELETE /torneos/:id
•	POST /torneos/:id/unirse
•	POST /torneos/:id/resultados
•	GET /torneos/:id/ranking
•	GET /torneos/usuarios/:usuarioId/resultados
________________________________________
Estrategia de Testing
Implementado con:
•	Jest (pruebas unitarias)
•	Supertest (pruebas e2e)
Escenarios cubiertos:
•	Login válido
•	Creación de torneo
•	Prevención de unión duplicada
•	Envío de resultado sin participación
•	Validación correcta de ranking
•	Transición automática de estado
________________________________________
Swagger
Disponible en:
http://localhost:3002/docs
Documenta:
•	DTOs
•	Esquemas de request
•	Esquemas de response
•	Autenticación Bearer
________________________________________
Despliegue
•	Dockerizado
•	Multi-stage build
•	Corre en el puerto 3002
Variables de entorno requeridas:
•	ROBLE_AUTH_BASE
•	ROBLE_DB_BASE
•	ROBLE_DBNAME
________________________________________
Limitaciones del MVP
•	No incluye frontend.
•	Recurrencia no automatizada.
•	No valida internamente la lógica de Sudoku.
•	Dependencia total de disponibilidad de ROBLE.
•	No implementa cache para ranking.
________________________________________
Escalabilidad
•	Arquitectura independiente del juego.
•	Estructura modular.
•	Preparado para nuevos juegos.
•	Preparado para automatización futura de recurrencia.
•	Posibilidad de cambiar proveedor de base de datos sin modificar lógica de negocio.
________________________________________
Conclusión Técnica
El módulo de Torneos implementa una infraestructura competitiva desacoplada, validada mediante pruebas automatizadas e integrada con ROBLE como proveedor externo de autenticación y base de datos. Su diseño modular y escalable permite futura expansión dentro del ecosistema CEREBRO sin generar acoplamientos rígidos.
