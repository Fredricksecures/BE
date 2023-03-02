
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/modules/user/entity/student.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import { settingErrors, settingMessages } from 'src/utils/messages';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  updateStudentProfileReq
} from 'src/modules/setting/dto/setting.dto';
@Injectable()
export class SettingService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}
  async getStudents(parentID) {
    let foundStudent;
    try {
        foundStudent = await this.studentRepo.find({
          where: { parent: parentID },
          relations: ['parent'],
        });
      } catch (exp) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: settingErrors.checkingStudents + exp,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
    return {
        success: true,
        foundStudent,
      };
  }
 
  async updateStudentProfile(studentID,updateStudentProfileReq: updateStudentProfileReq,) {
    const { imageURL, firstName, lastName, gender, dateOfBirth } = updateStudentProfileReq;
    let foundStudent;
    let  updatedStudent: Student;
    try {
        foundStudent = await this.studentRepo.find({
          where: { id: studentID }
        });
      } catch (exp) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: settingErrors.checkingStudents + exp,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
      if (!foundStudent) {
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
          ...foundStudent,
          imageURL: imageURL ?? foundStudent.imageURL,
          firstName: firstName ?? foundStudent.firstName,
          lastName: lastName ?? foundStudent.lastName,
          gender: gender ?? foundStudent.gender,
          dateOfBirth: dateOfBirth ?? foundStudent.dateOfBirth,
        });
  
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

}
