import { Injectable } from '@nestjs/common';
import { RobleService } from '../roble/roble.service';

export interface RankingRecord {
  _id?: string;
  usuarioId: string;
  elo: number;
  victorias: number;
  derrotas: number;
  fechaActualizacion: string;
}

@Injectable()
export class RankingService {
  private readonly TABLE = 'RankingPvP';

  constructor(private readonly roble: RobleService) {}

  async getOrCreateRanking(usuarioId: string, token: string): Promise<RankingRecord> {
    const records = await this.roble.read<RankingRecord>(token, this.TABLE, { usuarioId });

    if (records.length > 0) return records[0];

    const result = await this.roble.insert<RankingRecord>(token, this.TABLE, [
      {
        usuarioId,
        elo: 1000,
        victorias: 0,
        derrotas: 0,
        fechaActualizacion: new Date().toISOString(),
      },
    ]);

    return result.inserted[0];
  }

  async updateElo(ganadorId: string, perdedorId: string, token: string) {
    const ganadorRank = await this.getOrCreateRanking(ganadorId, token);
    const perdedorRank = await this.getOrCreateRanking(perdedorId, token);

    const eloG = ganadorRank.elo;
    const eloP = perdedorRank.elo;

    const expectedGanador = 1 / (1 + Math.pow(10, (eloP - eloG) / 400));
    const nuevoEloGanador = Math.round(eloG + 32 * (1 - expectedGanador));
    const nuevoEloPerdedor = Math.round(eloP + 32 * (0 - (1 - expectedGanador)));

    await this.roble.update(token, this.TABLE, '_id', ganadorRank._id!, {
      elo: nuevoEloGanador,
      victorias: ganadorRank.victorias + 1,
      fechaActualizacion: new Date().toISOString(),
    });

    await this.roble.update(token, this.TABLE, '_id', perdedorRank._id!, {
      elo: nuevoEloPerdedor,
      derrotas: perdedorRank.derrotas + 1,
      fechaActualizacion: new Date().toISOString(),
    });

    return {
      ganador: { usuarioId: ganadorId, nuevoElo: nuevoEloGanador },
      perdedor: { usuarioId: perdedorId, nuevoElo: nuevoEloPerdedor },
    };
  }

  async getTop20(token: string): Promise<RankingRecord[]> {
    const all = await this.roble.read<RankingRecord>(token, this.TABLE);
    return all.sort((a, b) => b.elo - a.elo).slice(0, 20);
  }

  async getMyRanking(usuarioId: string, token: string): Promise<RankingRecord> {
    return this.getOrCreateRanking(usuarioId, token);
  }
}
