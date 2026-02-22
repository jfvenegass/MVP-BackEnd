import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TorneosModule } from './torneos/torneos.module';
import { RobleModule } from './roble/roble.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TorneosModule,
    RobleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
