import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TitlesService } from './titles.service';
import { TitlesController } from './titles.controller';

@Module({
  imports: [ConfigModule],
  controllers: [TitlesController],
  providers: [TitlesService],
  exports: [TitlesService],
})
export class TitlesModule {}