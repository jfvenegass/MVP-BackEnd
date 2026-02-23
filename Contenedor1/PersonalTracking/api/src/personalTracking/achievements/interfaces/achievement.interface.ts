// src/personalTracking/achievements/interfaces/achievement.interface.ts
export interface Achievement {
  _id: string;
  nombre: string;
  descripcion: string;
  icono?: string;
  puntos: number;
  esSecreto?: boolean;
}