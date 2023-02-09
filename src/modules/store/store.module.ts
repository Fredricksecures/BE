import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleConfigs } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature(ModuleConfigs['store'].entities)],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
