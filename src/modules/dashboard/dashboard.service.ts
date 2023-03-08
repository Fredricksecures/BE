import { MockTestQuestions } from 'src/modules/admin/entity/mockTestQuestions.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../user/entity/user.entity';
import { GetAllUsersSessionsReq } from '../admin/dto/admin.dto';
import Logger from 'src/utils/logger';
import { Session } from 'src/modules/auth/entity/session.entity';
import { Student } from 'src/modules/user/entity/student.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import { dashboardMessages, dashboardErrors } from 'src/utils/messages';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import {
  
} from 'src/modules/dashboard/dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}
  async getStudentDetails(id: string) {
    let data;
    try {
      data = await this.studentRepo.findOneBy({ id 
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: dashboardErrors.failedToFetchStudent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      data,
      success: true,
    };
  }
  }
