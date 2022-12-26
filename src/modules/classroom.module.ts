import { Module } from '@nestjs/common';
import { ClassroomService } from '../services/classroom.service';
import { ClassroomController } from '../controllers/classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['classroom'].entities),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
