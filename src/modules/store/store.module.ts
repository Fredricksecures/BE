import { UtilityService } from './../utility/utility.service';
import { UserService } from './../user/user.service';
import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleConfigs, jwtConfig } from 'src/utils/constants';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['store'].entities),
  ],
  controllers: [StoreController],
  providers: [UtilityService, StoreService, UserService],
})
export class StoreModule {}
