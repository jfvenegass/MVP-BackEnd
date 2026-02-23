// src/personalTracking/achievements/interfaces/achievement.interface.ts

export interface Achievement {
  _id: string;
  nombre: string;
  descripcion: string;
  xpRequerido: number;
  icono?: string;
  activo: boolean;
}