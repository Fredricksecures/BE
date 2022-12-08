import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GET_ALL_ENTITIES } from './constants';
import { AuthModule } from './modules/auth.module';
import { AdminModule } from './modules/admin.module';
import { SubscriptionModule } from './modules/subscription.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './services/config.service';
import { UtilityModule } from './modules/utility.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig(GET_ALL_ENTITIES())),
    UtilityModule,
    AuthModule,
    AdminModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
