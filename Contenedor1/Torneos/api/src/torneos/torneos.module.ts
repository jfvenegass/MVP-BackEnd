import { Module } from '@nestjs/common';
import { TorneosController } from './torneos.controller';
import { TorneosService } from './torneos.service';
import { RobleModule } from 'src/roble/roble.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [RobleModule, AuthModule],
  controllers: [TorneosController],
  providers: [TorneosService],
})
export class TorneosModule {}
