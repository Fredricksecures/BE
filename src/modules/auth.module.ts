import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';
import { AuthSeeder } from 'src/seeders/auth.seeder';
import { UtilityService } from 'src/services/utility.service';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['auth'].entities),
  ],
  controllers: [AuthController],
  providers: [AuthService, UtilityService, AuthSeeder],
})
export class AuthModule {}
