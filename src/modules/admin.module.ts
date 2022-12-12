import { Module } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { AdminController } from '../controllers/admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/constants';
import { UtilityService } from 'src/services/utility.service';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['admin'].entities),
  ],
  controllers: [AdminController],
  providers: [AdminService, UtilityService],
})
export class AdminModule {}
