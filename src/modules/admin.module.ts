import { Module } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { AdminController } from '../controllers/admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';
import { UtilityService } from 'src/services/utility.service';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['admin'].entities),
  ],
  controllers: [AdminController],
  providers: [AdminService, UtilityService, UserService],
})
export class AdminModule {}
