import { updateAccountNotificationReq } from './dto/setting.dto';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/modules/user/entity/student.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import { settingErrors, settingMessages } from 'src/utils/messages';
import { AccountSecurities } from './entities/setting.security.entity';
import { settingDisplay } from './entities/setting.display.entity';
import { AccountNotification } from './entities/setting.notification.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  updateStudentProfileReq,
  createStudentProfileReq,
  updateAccountSecuirtyReq,
  updateAccountDisplayReq,
  GetStudentReq,
} from 'src/modules/setting/dto/setting.dto';
@Injectable()
export class SettingService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Parent) private parentRepo: Repository<Parent>,
    @InjectRepository(AccountSecurities)
    private securityRepo: Repository<AccountSecurities>,
    @InjectRepository(settingDisplay)
    private displayRepo: Repository<settingDisplay>,
    @InjectRepository(AccountNotification)
    private notificationRepo: Repository<AccountNotification>,
  ) {}
  async getStudents(student_id, getStudentReq: GetStudentReq) {
    const { parentId, user } = getStudentReq;
    let foundStudents: Student | Array<Student>;
    if (student_id) {
      foundStudents = await this.studentRepo.find({
        where: { id: student_id },
        relations: ['parent'],
      });
    } else {
      foundStudents = await this.studentRepo.find({
        where: { parent: { id: user.parent.id } },
        relations: ['parent'],
      });
    }
    if (!foundStudents) {
      Logger.error(settingErrors.studentNotFound);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.studentNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      success: true,
      foundStudents,
    };
  }

  async updateStudentProfile(
    studentID,
    updateStudentProfileReq: updateStudentProfileReq,
  ) {
    const { imageURL, firstName, lastName, gender, dateOfBirth } =
      updateStudentProfileReq;
    let foundStudent: Student[];
    let updatedStudent: Student;
    try {
      foundStudent = await this.studentRepo.find({
        where: { id: studentID },
      });
      console.log(foundStudent[0].id);
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.checkingStudents + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (foundStudent.length == 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.studentNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedStudent = await this.studentRepo.save({
        ...foundStudent[0],
        imageURL: imageURL ?? foundStudent[0].Image,
        firstName: firstName ?? foundStudent[0].firstName,
        lastName: lastName ?? foundStudent[0].lastName,
        gender: gender ?? foundStudent[0].Gender,
        dateOfBirth: dateOfBirth ?? foundStudent[0].dateOfBirth,
      });
      console.log(updatedStudent);
      return {
        success: true,
        updatedStudent,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.updatingStudent,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async createStudentProfile(
    createStudentProfileReq: createStudentProfileReq,
    GetStudentReq: GetStudentReq,
  ) {
    const { imageURL, firstName, lastName, gender, dateOfBirth } =
      createStudentProfileReq;
    const { user } = GetStudentReq;
    let studentCreated: Student, foundParent: Parent;
    try {
      foundParent = await this.parentRepo.findOne({
        where: {
          id: user.parent.id,
        },
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
    if (!foundParent) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.failedToFetchParent,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      studentCreated = await this.studentRepo.save({
        imageURL,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        parent: foundParent,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.saveStudent + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      studentCreated,
      success: true,
    };
  }

  async updateAccountSecuirty(
    updateAccountSecuirtyReq: updateAccountSecuirtyReq,
    GetStudentReq: GetStudentReq,
  ) {
    const { user } = GetStudentReq;
    const { informationCollection, twoFactorAuth } = updateAccountSecuirtyReq;
    let foundAccountSecurity;
    let updatedSecurity: AccountSecurities;
    try {
      foundAccountSecurity = await this.securityRepo.find({
        where: { parent: { id: user.parent.id } },
        relations: ['parent'],
      });
      console.log(foundAccountSecurity[0])
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.checkingParent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundAccountSecurity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.parentNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedSecurity = await this.securityRepo.save({
        ...foundAccountSecurity[0],
        informationCollection:
          informationCollection ?? foundAccountSecurity[0].informationCollection,
        twoFactorAuth: twoFactorAuth ?? foundAccountSecurity[0].twoFactorAuth,
      });

      return {
        success: true,
        updatedSecurity,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.updatingSecurity,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getSecurityDetails(GetStudentReq: GetStudentReq,
    ) {
      const { user } = GetStudentReq;
    let foundAccountSecurity;
    try {
      foundAccountSecurity = await this.securityRepo.find({
        where: { parent: {id:user.parent.id} },
        relations: ['parent'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.failedToFetchSecurity + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      success: true,
      foundAccountSecurity,
    };
  }

  async updateAccountDisplay(
    updateAccountDisplayReq: updateAccountDisplayReq,GetStudentReq: GetStudentReq,
    ) {
      const { user } = GetStudentReq;
    const { appearence, resolution } = updateAccountDisplayReq;
    let updatedResolution;
    let updatedDisplay: settingDisplay;
    try {
      updatedResolution = await this.displayRepo.find({
        where: { parent: {id:user.parent.id }},
        relations: ['parent'],
      });
      console.log(updatedResolution)
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.checkingParent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!updatedResolution) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.parentNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedDisplay = await this.displayRepo.save({
        ...updatedResolution[0],
        appearence: appearence ?? updatedResolution[0].appearence,
        resolution: resolution ?? updatedResolution[0].resolution,
      });

      return {
        success: true,
        updatedDisplay,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.updatingDisplay,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getDisplayDetails(GetStudentReq: GetStudentReq,
    ) {
      const { user } = GetStudentReq;
    let foundAccountDisplay;
    try {
      foundAccountDisplay = await this.displayRepo.find({
        where: { parent: {id: user.parent.id} },
        relations: ['parent'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.failedToFetchDisplay + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      success: true,
      foundAccountDisplay,
    };
  }

  async updateAccountNotification(
    GetStudentReq: GetStudentReq,
    updateAccountNotificationReq: updateAccountNotificationReq,
  ) {
    const { user } = GetStudentReq;
    const { bonusNotification, practiceReminder, emailNotification } =
      updateAccountNotificationReq;
    let foundNotification;
    let updatedNotification: AccountNotification;
    try {
      foundNotification = await this.notificationRepo.find({
        where: { parent: {id: user.parent.id} },
        relations: ['parent'],
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
    if (!foundNotification) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.parentNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedNotification = await this.notificationRepo.save({
        ...foundNotification[0],
        bonusNotification:
          bonusNotification ?? foundNotification[0].bonusNotification,
        practiceReminder:
          practiceReminder ?? foundNotification[0].practiceReminder,
        emailNotification:
          emailNotification ?? foundNotification[0].emailNotification,
      });

      return {
        success: true,
        updatedNotification,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.updatingNotification,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getNotificationDetails(GetStudentReq: GetStudentReq) {
    let foundAccountNotification;
    const { user } = GetStudentReq;
    try {
      foundAccountNotification = await this.notificationRepo.find({
        where: { parent: {id:user.parent.id} },
        relations: ['parent'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: settingErrors.failedToFetchNotification + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      success: true,
      foundAccountNotification,
    };
  }
}
