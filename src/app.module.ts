import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GET_ALL_ENTITIES } from './utils/constants';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UtilityModule } from './modules/utility/utility.module';
import { ContentModule } from './modules/content/content.module';
import { LiveClassModule } from './modules/liveClass/live.class.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig(GET_ALL_ENTITIES())),
    UtilityModule,
    AuthModule,
    // AdminModule,
    // SubscriptionModule,
    // ContentModule,
    // LiveClassModule,
    // UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
