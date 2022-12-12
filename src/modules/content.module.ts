import { Module } from '@nestjs/common';
import { ContentService } from '../services/content.service';
import { ContentController } from '../controllers/content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/constants';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['content'].entities),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
