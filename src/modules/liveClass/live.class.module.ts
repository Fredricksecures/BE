import { Module } from '@nestjs/common';
import { LiveClassService } from './live.class.service';
import { LiveClassController } from './live.class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['liveclass'].entities),
  ],
  controllers: [LiveClassController],
  providers: [LiveClassService],
})
export class LiveClassModule {}
