import { Module } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { UtilityController } from './utility.controller';
import { UtilitySeeder } from 'src/modules/utility/utlity.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleConfigs } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature(ModuleConfigs['utility'].entities)],
  controllers: [UtilityController],
  providers: [UtilityService, UtilitySeeder],
})
export class UtilityModule {}
