# Personal Tracking System - Backend Documentation

## Overview

This backend system is built with NestJS and integrates with ROBLE API
for database operations. It provides modular services for:

-   Authentication
-   Profiles
-   Achievements
-   Game Sessions
-   Game Statistics

All modules communicate with ROBLE using authenticated HTTP requests.

------------------------------------------------------------------------

# Architecture

    AppModule
     └── PersonalTrackingModule
          ├── AuthModule
          ├── ProfilesModule
          ├── AchievementsModule
          ├── TitlesModule
          ├── GameSessionsModule
          └── GameStatsModule

------------------------------------------------------------------------

# Database Design

The system uses the following entities:

## Perfil

-   id (uuid, PK)
-   usuarioId (uuid, FK)
-   nivel (int)
-   experiencia (int)
-   rachaActual (int)
-   rachaMaxima (int)
-   salvadoresRacha (int)
-   tituloActivoId (uuid, FK)

## Juego

-   id (uuid, PK)
-   nombre (string)
-   descripcion (string)
-   esRankeado (boolean)

## EstadisticasJuegoUsuario

-   id (uuid, PK)
-   usuarioId (uuid, FK)
-   juegoId (uuid, FK)
-   elo (int)
-   partidasJugadas (int)
-   victorias (int)
-   derrotas (int)
-   empates (int)
-   ligaId (uuid, FK)

## Liga

-   id (uuid, PK)
-   nombre (string)
-   eloMinimo (int)
-   eloMaximo (int)
-   icono (string)

## Logro

-   id (uuid, PK)
-   nombre (string)
-   descripcion (string)
-   icono (string)
-   puntos (int)
-   esSecreto (boolean)

## LogroUsuario

-   id (uuid, PK)
-   usuarioId (uuid, FK)
-   logroId (uuid, FK)
-   desbloqueadoEn (datetime)

## Insignia

-   id (uuid, PK)
-   nombre (string)
-   icono (string)
-   descripcion (string)

## InsigniaUsuario

-   id (uuid, PK)
-   usuarioId (uuid, FK)
-   insigniaId (uuid, FK)
-   otorgadaEn (datetime)

## Titulo

-   id (uuid, PK)
-   nombre (string)
-   descripcion (string)
-   rareza (string)

## SesionJuego

-   id (uuid, PK)
-   usuarioId (uuid, FK)
-   juegoId (uuid, FK)
-   puntaje (int)
-   resultado (string)
-   cambioElo (int)
-   jugadoEn (datetime)

------------------------------------------------------------------------

# Modules Documentation

## Auth Module

Handles: 
- login 
- signup 
- signup-direct 
- refresh token 
- logout

On successful login: 
- Ensures profile exists 
- Returns access and refresh tokens

------------------------------------------------------------------------

## Profiles Module

Handles: 
- Create profile 
- Get profile by user ID 
- Add experience 
- Automatic level up logic

### Leveling System

XP required per level:

-   Level 1--10: level × 100
-   Level 11--30: level × 150
-   Level 31--50: level × 250
-   50+: level + 250

Max level cap: 100

------------------------------------------------------------------------

## Achievements Module

CRUD operations for Logro table.

Additional operations: 
- Assign achievement to user 
- Remove achievement from user 
- Assign title to profile 
- Remove title from profile

## Titles Module

CRUD operations for Titulo table.


------------------------------------------------------------------------

## Game Sessions Module

Responsible for: 
- Creating new session records

Each session records: 
- Score 
- Result 
- Elo change 
- Date played

------------------------------------------------------------------------

## Game Stats Module

Responsible for:

-   Initialize stats for all games
-   Increase victories
-   Increase defeats
-   Increase draws
-   Increase total matches
-   Update ELO
-   Change league

Initial ELO: 1000

------------------------------------------------------------------------

# Swagger

Swagger is configured at:

http://localhost:3002/docs

It automatically documents: 
- DTOs 
- Request bodies 
- Response schemas

------------------------------------------------------------------------

# Security

-   Access tokens required for database operations.
-   Tokens passed via Authorization header (Bearer token).
-   DB name loaded from environment variable ROBLE_DB_NAME.

------------------------------------------------------------------------

# Deployment

-   Dockerized for production.
-   Runs on port 3002.
-   Uses multi-stage Dockerfile for optimized builds.

------------------------------------------------------------------------
