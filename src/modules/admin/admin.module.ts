import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, ModuleConfigs } from 'src/utils/constants';
import { UtilityService } from 'src/modules/utility/utility.service';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from '../auth/auth.service';
import { SubscriptionService } from '../subscription/subscription.service';
@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['admin'].entities),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    UtilityService,
    UserService,
    AuthService,
    SubscriptionService,
  ],
})
export class AdminModule {}
