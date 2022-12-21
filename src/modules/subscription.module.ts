import { Module } from '@nestjs/common';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionController } from '../controllers/subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['subscription'].entities),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
