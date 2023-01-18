import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';
import { AuthSeeder } from 'src/modules/auth/auth.seeder';
import { UtilityService } from 'src/modules/utility/utility.service';
import { UserService } from 'src/modules/user/user.service';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['auth'].entities),
  ],
  controllers: [AuthController],
  providers: [AuthService, UtilityService, AuthSeeder, UserService],
})
export class AuthModule {}
