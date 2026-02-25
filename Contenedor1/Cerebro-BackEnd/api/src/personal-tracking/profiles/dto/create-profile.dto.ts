// src/personalTracking/profiles/dto/create-profile.dto.ts
export class CreateProfileDto {
  nivel?: number; // opcional, default 1
  experiencia?: number; // opcional, default 0
  rachaActual?: number; // opcional, default 0
  rachaMaxima?: number; // opcional, default 0
  salvadoresRacha?: number; // opcional, default 0
  tituloActivoId?: string | null; // opcional
}
