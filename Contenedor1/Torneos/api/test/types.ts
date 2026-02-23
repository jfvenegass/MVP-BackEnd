export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CreateTorneoResponse {
  id: string;
  estado: string;
}

export interface RankingItem {
  usuarioId: string;
  puntaje: number;
  tiempo: number;
}

export interface TorneoResponse {
  id: string;
  estado: string;
}
