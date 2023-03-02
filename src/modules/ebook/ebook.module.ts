import { Module } from '@nestjs/common';
import { EbookService } from './ebook.service';
import { EbookController } from './ebook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleConfigs, jwtConfig } from 'src/utils/constants';
import { UtilityService } from '../utility/utility.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    jwtConfig,
    TypeOrmModule.forFeature(ModuleConfigs['ebook'].entities),
  ],
  controllers: [EbookController],
  providers: [EbookService, UtilityService, UserService],
})
export class EbookModule {}
