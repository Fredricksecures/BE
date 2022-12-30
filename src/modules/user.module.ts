import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';
import { UtilityService } from 'src/services/utility.service';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['user'].entities),
  ],
  controllers: [UserController],
  providers: [UserService, UtilityService],
})
export class UserModule {}
