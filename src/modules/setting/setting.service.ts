import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/modules/user/entity/student.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import { settingErrors, settingMessages } from 'src/utils/messages';

import {
  updateAccountSettingsReq,
  GetStudentReq,
} from 'src/modules/setting/dto/setting.dto';
import { Settings } from './entity/settings.entity';
import { User } from '../user/entity/user.entity';
@Injectable()
export class SettingService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Settings)
    private settingsRepo: Repository<Settings>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async updateAccountSettings(
    GetStudentReq: GetStudentReq,
    updateAccountSettingsReq: updateAccountSettingsReq,
  ) {
    const { user } = GetStudentReq;
    const {
      bonusNotification,
      practiceReminder,
      emailNotification,
      appearence,
      resolution,
      informationCollection,
      twoFactorAuth,
    } = updateAccountSettingsReq;
    let foundAccountSetings;
    let updatedAccountSettings: Settings;
    try {
      console.log(user)
      foundAccountSetings = await this.settingsRepo.find({
        where: { user: { id: user.id } },
        relations: ['user'],
      });
      console.log(foundAccountSetings);
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.checkingParent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundAccountSetings) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.parentNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      updatedAccountSettings = await this.settingsRepo.save({
        ...foundAccountSetings[0],
        bonusNotification:
          bonusNotification ?? foundAccountSetings[0].bonusNotification,
        practiceReminder:
          practiceReminder ?? foundAccountSetings[0].practiceReminder,
        emailNotification:
          emailNotification ?? foundAccountSetings[0].emailNotification,
        appearence: appearence ?? foundAccountSetings[0].appearence,
        resolution: resolution ?? foundAccountSetings[0].resolution,
        informationCollection:
          informationCollection ?? foundAccountSetings[0].informationCollection,
        twoFactorAuth: twoFactorAuth ?? foundAccountSetings[0].twoFactorAuth,
        user : {id:user.id}
      });

      return {
        success: true,
        updatedAccountSettings,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.updatingSetings,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getSettingsDetails(GetStudentReq: GetStudentReq) {
    const { user } = GetStudentReq;
    let foundAccountSetings;
    try {
      foundAccountSetings = await this.settingsRepo.find({
        where: { user: { id: user.id } },
        relations: ['user'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.checkingParent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundAccountSetings) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.parentNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      success: true,
      foundAccountSetings,
    };
  }
}
