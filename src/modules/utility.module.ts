import { Module } from '@nestjs/common';
import { UtilityService } from '../services/utility.service';
import { UtilityController } from '../controllers/utility.controller';
import { UtilitySeeder } from 'src/seeders/utlity.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleConfigs } from 'src/constants';

@Module({
  imports: [TypeOrmModule.forFeature(ModuleConfigs['utility'].entities)],
  controllers: [UtilityController],
  providers: [UtilityService, UtilitySeeder],
})
export class UtilityModule {}
