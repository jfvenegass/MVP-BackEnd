import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RobleService } from '../roble/roble.service';
import { SudokuService } from '../sudoku/sudoku.service';
import { WebhookService } from '../webhook/webhook.service';
import { RankingService } from '../ranking/ranking.service';

interface MatchRecord {
  _id?: string;
  torneoId: string;
  jugador1Id: string;
  jugador2Id: string | null;
  estado: 'WAITING' | 'ACTIVE' | 'FINISHED' | 'FORFEIT';
  seed: number;
  solution: number[][];
  puntaje1: number;
  puntaje2: number;
  ganadorId: string | null;
  fechaCreacion: string;
  fechaInicio: string | null;
  fechaFin: string | null;
}

interface MovimientoRecord {
  _id?: string;
  matchId: string;
  usuarioId: string;
  row: number;
  col: number;
  value: number;
  esCorrecta: boolean;
  timestamp: string;
}

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);
  private readonly contenedor1Url: string;

  constructor(
    private readonly roble: RobleService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly sudokuService: SudokuService,
    private readonly webhookService: WebhookService,
    private readonly rankingService: RankingService,
  ) {
    this.contenedor1Url = this.config.getOrThrow<string>('CONTENEDOR1_BASE_URL');
  }

  private stripSolution(match: MatchRecord) {
    const { solution, ...matchSinSolucion } = match;
    return matchSinSolucion;
  }

  private async verifyTorneoPvp(torneoId: string, token: string) {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.contenedor1Url}/torneos/${torneoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      const torneo = res.data;
      if (torneo.tipo !== 'PVP') {
        throw new BadRequestException('El torneo no es de tipo PVP');
      }
      return torneo;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new NotFoundException('Torneo no encontrado');
    }
  }

  private async verifyParticipante(torneoId: string, usuarioId: string, token: string) {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.contenedor1Url}/torneos/${torneoId}/participantes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      const participantes: any[] = res.data;
      const isParticipant = participantes.some(
        (p) => p.usuarioId === usuarioId || p.userId === usuarioId || p._id === usuarioId,
      );
      if (!isParticipant) {
        throw new ForbiddenException('No estás inscrito en este torneo');
      }
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      throw new BadRequestException('No se pudo verificar la participación en el torneo');
    }
  }

  async createMatch(torneoId: string, usuarioId: string, token: string) {
    await this.verifyTorneoPvp(torneoId, token);
    await this.verifyParticipante(torneoId, usuarioId, token);

    const seed = Math.floor(Math.random() * 1000000);
    const { solution } = this.sudokuService.generateBoard(seed);

    const result = await this.roble.insert<MatchRecord>(token, 'Matches', [
      {
        torneoId,
        jugador1Id: usuarioId,
        jugador2Id: null,
        estado: 'WAITING',
        seed,
        solution,
        puntaje1: 0,
        puntaje2: 0,
        ganadorId: null,
        fechaCreacion: new Date().toISOString(),
        fechaInicio: null,
        fechaFin: null,
      },
    ]);

    return this.stripSolution(result.inserted[0]);
  }

  async joinMatch(matchId: string, usuarioId: string, token: string) {
    const matches = await this.roble.read<MatchRecord>(token, 'Matches', { _id: matchId });
    const match = matches[0];
    if (!match) throw new NotFoundException('Match no encontrado');
    if (match.estado !== 'WAITING') throw new BadRequestException('El match no está en espera');
    if (match.jugador1Id === usuarioId) {
      throw new BadRequestException('No puedes jugar contra ti mismo');
    }

    await this.verifyParticipante(match.torneoId, usuarioId, token);

    await this.roble.update(token, 'Matches', '_id', matchId, {
      jugador2Id: usuarioId,
      estado: 'ACTIVE',
      fechaInicio: new Date().toISOString(),
    });

    this.webhookService
      .emit(
        'match.started',
        [match.jugador1Id, usuarioId],
        {
          matchId,
          seed: match.seed,
          jugadores: [match.jugador1Id, usuarioId],
        },
        token,
      )
      .catch((e) => this.logger.warn(`Webhook emit error: ${e.message}`));

    const updated = await this.roble.read<MatchRecord>(token, 'Matches', { _id: matchId });
    return this.stripSolution(updated[0]);
  }

  async makeMove(
    matchId: string,
    usuarioId: string,
    row: number,
    col: number,
    value: number,
    token: string,
  ) {
    const matches = await this.roble.read<MatchRecord>(token, 'Matches', { _id: matchId });
    const match = matches[0];
    if (!match) throw new NotFoundException('Match no encontrado');
    if (match.estado !== 'ACTIVE') throw new BadRequestException('El match no está activo');
    if (match.jugador1Id !== usuarioId && match.jugador2Id !== usuarioId) {
      throw new ForbiddenException('No eres jugador de este match');
    }

    const esCorrecta = this.sudokuService.validateMove(match.solution, row, col, value);

    await this.roble.insert<MovimientoRecord>(token, 'MovimientosPvP', [
      {
        matchId,
        usuarioId,
        row,
        col,
        value,
        esCorrecta,
        timestamp: new Date().toISOString(),
      },
    ]);

    const isJugador1 = match.jugador1Id === usuarioId;
    let puntaje1 = match.puntaje1;
    let puntaje2 = match.puntaje2;

    if (esCorrecta) {
      if (isJugador1) {
        puntaje1 += 1;
        await this.roble.update(token, 'Matches', '_id', matchId, { puntaje1 });
      } else {
        puntaje2 += 1;
        await this.roble.update(token, 'Matches', '_id', matchId, { puntaje2 });
      }
    }

    const jugador2Id = match.jugador2Id!;
    const oponenteId = isJugador1 ? jugador2Id : match.jugador1Id;
    const puntajeOponente = isJugador1 ? puntaje1 : puntaje2;

    this.webhookService
      .emit(
        'opponent.moved',
        [oponenteId],
        { matchId, row, col, value, esCorrecta, puntajeOponente },
        token,
      )
      .catch((e) => this.logger.warn(`Webhook emit error: ${e.message}`));

    const { board } = this.sudokuService.generateBoard(match.seed);
    const celdasVacias = board.flat().filter((c) => c === 0).length;

    if (puntaje1 + puntaje2 >= celdasVacias) {
      await this.roble.update(token, 'Matches', '_id', matchId, {
        estado: 'FINISHED',
        ganadorId: usuarioId,
        fechaFin: new Date().toISOString(),
      });

      const perdedorId = oponenteId;
      const eloResult = await this.rankingService.updateElo(usuarioId, perdedorId, token);

      this.webhookService
        .emit(
          'match.finished',
          [match.jugador1Id, jugador2Id],
          {
            matchId,
            ganadorId: usuarioId,
            puntajeFinal: { [match.jugador1Id]: puntaje1, [jugador2Id]: puntaje2 },
            nuevoElo: {
              [eloResult.ganador.usuarioId]: eloResult.ganador.nuevoElo,
              [eloResult.perdedor.usuarioId]: eloResult.perdedor.nuevoElo,
            },
          },
          token,
        )
        .catch((e) => this.logger.warn(`Webhook emit error: ${e.message}`));

      return {
        esCorrecta,
        matchTerminado: true,
        ganadorId: usuarioId,
        puntaje1,
        puntaje2,
      };
    }

    return { esCorrecta, matchTerminado: false, puntaje1, puntaje2 };
  }

  async getMatch(matchId: string, token: string) {
    const matches = await this.roble.read<MatchRecord>(token, 'Matches', { _id: matchId });
    const match = matches[0];
    if (!match) throw new NotFoundException('Match no encontrado');
    return this.stripSolution(match);
  }

  async forfeit(matchId: string, usuarioId: string, token: string) {
    const matches = await this.roble.read<MatchRecord>(token, 'Matches', { _id: matchId });
    const match = matches[0];
    if (!match) throw new NotFoundException('Match no encontrado');
    if (match.estado !== 'ACTIVE') throw new BadRequestException('El match no está activo');
    if (match.jugador1Id !== usuarioId && match.jugador2Id !== usuarioId) {
      throw new ForbiddenException('No eres jugador de este match');
    }

    const j2Id = match.jugador2Id!;
    const oponenteId = match.jugador1Id === usuarioId ? j2Id : match.jugador1Id;

    await this.roble.update(token, 'Matches', '_id', matchId, {
      estado: 'FORFEIT',
      ganadorId: oponenteId,
      fechaFin: new Date().toISOString(),
    });

    await this.rankingService.updateElo(oponenteId, usuarioId, token);

    this.webhookService
      .emit(
        'match.forfeit',
        [match.jugador1Id, j2Id],
        {
          matchId,
          ganadorId: oponenteId,
          razon: `El jugador ${usuarioId} abandonó la partida`,
        },
        token,
      )
      .catch((e) => this.logger.warn(`Webhook emit error: ${e.message}`));

    return { matchId, ganadorId: oponenteId, estado: 'FORFEIT' };
  }
}
