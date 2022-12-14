import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { GetAllUsersSessionsReq } from 'src/dto/admin.dto';
import Logger from 'src/utils/logger';
import { Session } from 'src/entities/session.entity';
import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';

import{ 
  createLessonReq, 
  createChapterReq,
  updateChapterReq,
  updateLessonReq
 } from 'src/dto/content.dto';
import { Lesson } from 'src/entities/lesson.entity';
import { adminErrors, adminMessages,contentMessages,contentErrors } from 'src/constants';
import { Chapter } from 'src/entities/chapter.entity';
import { Subject } from 'src/entities/subject.entity';




config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class ContentService {
  constructor(
    private jwtService: JwtService, 
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Chapter) private chapterRepo: Repository<Chapter>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    // @InjectRepository(Parent) private parentRepo: Repository<Parent>,
  ) // @InjectRepository(User) private userRepo: Repository<User>,
  // @InjectRepository(Session) private sessionRepo: Repository<Session>,
  // @InjectRepository(Student) private studentRepo: Repository<Student>,
  
  {}

  // async formatPayload(user: any, type: string) {
  //   switch (type) {
  //     case UserTypes.DEFAULT:
  //       delete user?.createdAt;
  //       delete user?.updatedAt;
  //       delete user?.parent?.id;
  //       delete user?.parent?.createdAt;
  //       delete user?.parent?.updatedAt;
  //       delete user?.parent?.password;
  //       delete user?.parent?.passwordResetPin;
  //       break;
  //     case UserTypes.CUSTOMERCARE:
  //       delete user?.password;
  //       delete user?.passwordResetPin;
  //       delete user?.onboardingStage;
  //       break;

  //     default:
  //       break;
  //   }

  //   return user;
  // }

  //async getChapters(user: GetAllUsersSessionsReq) {
    // const { userId } = user;
    // let foundUser: User;
    // try {
    //   foundUser = await this.userRepo.findOne({
    //     where: { id: userId },
    //     relations: ['parent', 'parent.sessions'],
    //   });
    // } catch (exp) {
    //   Logger.error(adminErrors.checkingUser + exp);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.checkingUser + exp,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // if (!foundUser) {
    //   Logger.error(adminErrors.userNotFoundWithId);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.userNotFoundWithId,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // if (!foundUser.parent) {
    //   Logger.error(adminErrors.noParentFound);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.noParentFound,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // if (!foundUser.parent.sessions) {
    //   Logger.error(adminErrors.sessionNotFoundWithId);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.sessionNotFoundWithId,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // return {
    //   success: true,
    //   sessions: foundUser.parent.sessions,
    // };
  //}
  async getChapters(){
    let foundChapters: Array<Chapter>;
    try {
      foundChapters = await this.chapterRepo.find({});
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchChapter + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return foundChapters;
  }
  async getLessons() {
    let foundLessons: Array<Lesson>;
    try {
      foundLessons = await this.lessonRepo.find({});
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchLessons + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return foundLessons;
  }
  async createLesson(createLessonReq: createLessonReq) {
    const {
      type,
      chapterId
    } = createLessonReq;
    let  lessonCreated: Lesson, foundChapterId:Chapter;
    try {
      foundChapterId = await this.chapterRepo.findOne({
        where: {
            id: chapterId,
        },
       
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchChapter+ exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      lessonCreated = await this.lessonRepo.save({
        type,
        chapter:foundChapterId,
        
      });
    }
      catch (e) {
       
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: contentErrors.saveLesson + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
  
      return {
        lessonCreated,
        success: true,
      };
    }

      async createChapter(createChapterReq: createChapterReq) {
        const {
          type,
          subjectId
        } = createChapterReq;
        let  chapterCreated: Chapter, foundSubjectId:Subject;
        try {
          foundSubjectId = await this.subjectRepo.findOne({
            where: {
                id: subjectId,
            },
           
          });
        } catch (exp) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_IMPLEMENTED,
              error: contentErrors.failedToFetchSubject+ exp,
            },
            HttpStatus.NOT_IMPLEMENTED,
          );
        }
        try {
          chapterCreated = await this.chapterRepo.save({
            type,
            subject:foundSubjectId,
           
          });
        }
          catch (e) {
            throw new HttpException(
              {
                status: HttpStatus.NOT_IMPLEMENTED,
                error: contentErrors.saveChapter + e,
              },
              HttpStatus.NOT_IMPLEMENTED,
            );
          }
      
          return {
            chapterCreated,
            success: true,
          };
  }
  
  async updateChapterProfile(id: string, updateChapterReq: updateChapterReq) {
    const { type } = updateChapterReq;

    let foundChapter, updatedChapter: Chapter;

    try {
      foundChapter = await this.chapterRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingChapter + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundChapter) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.chapterNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedChapter = await this.chapterRepo.save({
        ...foundChapter,
        type: type ?? foundChapter.type
      });

      return {
        success: true,
        updatedChapter,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingChapter,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
  
  async updateLessonProfile(id: string, updateLessonReq: updateLessonReq) {
    const { type } = updateLessonReq;

    let foundLesson, updatedLesson: Lesson;

    try {
      foundLesson = await this.lessonRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingLesson + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundLesson) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.lessonNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedLesson = await this.lessonRepo.save({
        ...foundLesson,
        type: type ?? foundLesson.type
      });

      return {
        success: true,
        updatedLesson,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingLesson,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
}
