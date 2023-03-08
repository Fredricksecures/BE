import { UserService } from 'src/modules/user/user.service';
import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';
import { UtilityService } from '../utility/utility.service';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['setting'].entities),
  ],
  controllers: [SettingController],
  providers: [SettingService, UserService, UtilityService],
})
export class SettingModule {}
