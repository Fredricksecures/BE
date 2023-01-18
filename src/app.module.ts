import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GET_ALL_ENTITIES } from './utils/constants';
import { AuthModule } from './modules/auth.module';
import { AdminModule } from './modules/admin.module';
import { SubscriptionModule } from './modules/subscription.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './services/config.service';
import { UtilityModule } from './modules/utility.module';
import { ContentModule } from './modules/content.module';
import { LiveClassModule } from './modules/live.class.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig(GET_ALL_ENTITIES())),
    UtilityModule,
    AuthModule,
    AdminModule,
    SubscriptionModule,
    ContentModule,
    LiveClassModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
