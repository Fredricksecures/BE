import { EmailTemplate } from './entity/email.template.entity';
import {
  Query,
  Controller,
  HttpStatus,
  Res,
  Get,
  Req,
  Patch,
  Post,
  Body,
  Param,
  HttpException,
  DefaultValuePipe,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';

import {
  UsersSessionsReq,
  UsersSessionsRes,
  SuspendUserReq,
  CustomerCareAgentReq,
  UpdateCustomerReq,
  BasicUpdateCustomerRes,
  createAdminReq,
  updateAdminReq,
  BasicUpdateAdminRes,
  BasicRegRes,
  createLessonReq,
  createChapterReq,
  updateLessonReq,
  updateSubjectReq,
  createTestReq,
  updateTestReq,
  createMockTestReq,
  updateMockTestReq,
  createBadgeReq,
  updateBadgeReq,
  createReportCardReq,
  updateReportCardReq,
  createSubjectReq,
  updateChapterReq,
  updateSettingReq,
  createClassReq,
  bookedClassReq,
  bookAttendeesReq,
  bulkRegistrationReq,
  bulkEmailReq,
  createEmailTemplateReq,
  updateEmailTemplateReq,
  AddBanner,
  UpdateBanner,
} from './dto/admin.dto';
import { AdminService } from './admin.service';
import { UserTypes } from 'src/utils/enums';
import { Request, Response } from 'express';
import { adminErrors, adminMessages } from 'src/utils/messages';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { UserService } from 'src/modules/user/user.service';
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Middleware
  async sessionGuard(req, resp) {
    await this.userService.verifyToken(req, resp, {
      noTimeout: true,
      useCookies: true,
    });
  }

  @Get('user-sessions')
  async getUserSessions(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    @Query() query,
  ) {
    const options: IPaginationOptions = { limit, page };
    const sessions = await this.adminService.getUserSessions(query, options);

    if (sessions) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.fetchSessionSuccess,
        sessions,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.fetchSessionFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('end-user-session')
  async endUserSession(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() query: UsersSessionsReq,
  ) {
    const { success, session }: UsersSessionsRes =
      await this.adminService.endUserSessions(query);
    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.endSessionSuccess,
        session,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.endSessionFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('recover-user-session')
  async recoverUserSession(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() query: UsersSessionsReq,
  ) {
    const { success, session }: UsersSessionsRes =
      await this.adminService.recoverUserSessions(query);
    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.recoverSessionSuccess,
        session,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.endSessionFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('students')
  async getStudents(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    @Query() params,
  ) {
    const options: IPaginationOptions = { limit, page };
    const users = await this.adminService.getStudents(params.parentId, options);

    resp.json({
      status: HttpStatus.OK,
      message: adminMessages.studentFetchSuccess,
      users: users.items,
      meta: users.meta,
    });
  }

  @Patch('suspend')
  async suspendUser(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: SuspendUserReq,
  ) {
    const { success, user } = await this.adminService.suspendUser(body);
    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.userSuspendedSuccess,
        user,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failedToSuspendUser,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-ccagent')
  async createCustomerCareAgent(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: CustomerCareAgentReq,
  ) {
    const { success, createdCustomerCare } =
      await this.adminService.createCustomerCareAgent(body);
    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.addCustomerCareSuccess,
        createdCustomerCare,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failedToSuspendUser,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-ccagent/:id')
  async updateCustomer(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: UpdateCustomerReq,
    @Param('id') id,
  ) {
    let { updatedCustomer, success }: BasicUpdateCustomerRes =
      await this.adminService.updateCustomerProfile(id, {
        ...req.body,
      });

    if (success) {
      updatedCustomer = await this.adminService.formatPayload(
        updatedCustomer,
        UserTypes.CUSTOMERCARE,
      );
      resp.json({
        success,
        message: adminMessages.updatedCustomerSuccess,
        status: HttpStatus.OK,
        updatedCustomer,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updateFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('ccagents')
  async getCustomers(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    const options: IPaginationOptions = { limit, page };
    const users = await this.adminService.getCustomers(options);
    resp.json({
      status: HttpStatus.OK,
      message: adminMessages.customerFetchSuccess,
      users: users.items,
      meta: users.meta,
    });
  }

  @Post('create-admin')
  async createAdmin(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createAdminReq,
  ) {
    const { success, createdUser }: BasicRegRes =
      await this.adminService.createAdmin(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.addAdminCreateSuccess,
        createdUser,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failToCreateAdmin,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-admin')
  async getAdmin(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    const options: IPaginationOptions = { limit, page };
    const users = await this.adminService.getAdmin(options);
    resp.json({
      status: HttpStatus.OK,
      message: adminMessages.adminFetchSuccess,
      users: users.items,
      meta: users.meta,
    });
  }

  @Patch('update-admin/:id')
  async updateAdmin(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateAdminReq,
    @Param('id') id,
  ) {
    let { updatedAdmin, success }: BasicUpdateAdminRes =
      await this.adminService.updateAdminProfile(id, {
        ...req.body,
      });

    if (success) {
      updatedAdmin = await this.adminService.formatPayload(
        updatedAdmin,
        UserTypes.CUSTOMERCARE,
      );
      resp.json({
        success,
        message: adminMessages.updatedCustomerSuccess,
        status: HttpStatus.OK,
        updatedAdmin,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updateFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('users')
  async getUsers(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    @Query() params,
  ) {
    const options: IPaginationOptions = { limit, page };
    const users = await this.adminService.getUsers(params.userId, options);

    resp.json({
      status: HttpStatus.OK,
      message: adminMessages.userFetchSuccess,
      users: users.items,
      meta: users.meta,
    });
  }

  @Post('create-lesson')
  async createLesson(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createLessonReq,
  ) {
    const { success, lessonCreated } = await this.adminService.createLesson(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.lessonCreateSuccess,
        lessonCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminMessages.failToCreateLesson,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-chapter')
  async createChapter(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createChapterReq,
  ) {
    const { success, chapterCreated } = await this.adminService.createChapter(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.chapterCreateSuccess,
        chapterCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminMessages.failToCreateLesson,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-lesson/:id')
  async updateLesson(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateLessonReq,
    @Param('id') id,
  ) {
    const { updatedLesson, success } =
      await this.adminService.updateLessonProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedLessonSuccess,
        status: HttpStatus.OK,
        updatedLesson,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingLessonFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-subject/:id')
  async updateSubject(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateSubjectReq,
    @Param('id') id,
  ) {
    const { updatedSubject, success } =
      await this.adminService.updateSubjectProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedSubjectSuccess,
        status: HttpStatus.OK,
        updatedSubject,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingSubjectFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-test')
  async createTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createTestReq,
  ) {
    const { success, testCreated } = await this.adminService.createTest(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.testCreateSuccess,
        testCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failToCreateTest,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-test/:id')
  async updateTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateTestReq,
    @Param('id') id,
  ) {
    const { updatedTest, success } = await this.adminService.updateTestProfile(
      id,
      {
        ...req.body,
      },
    );

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedTestSuccess,
        status: HttpStatus.OK,
        updatedTest,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingTestFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-mock-test')
  async createMockTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createMockTestReq,
  ) {
    const { success, mockTestCreated } = await this.adminService.createMockTest(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.mockTestCreateSuccess,
        mockTestCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failToCreateMockTest,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-mock-test/:id')
  async updateMockTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateMockTestReq,
    @Param('id') id,
  ) {
    const { updatedMockTest, success } =
      await this.adminService.updateMockTestProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedMockTestSuccess,
        status: HttpStatus.OK,
        updatedMockTest,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingMockTestFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-badge')
  async createBadge(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createBadgeReq,
  ) {
    const { success, badgeCreated } = await this.adminService.createBadge(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.badgeCreateSuccess,
        badgeCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failToCreateBadge,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-badge/:id')
  async updateBadge(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateBadgeReq,
    @Param('id') id,
  ) {
    const { updatedBadge, success } =
      await this.adminService.updateBadgeProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedBadgeSuccess,
        status: HttpStatus.OK,
        updatedBadge,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingBadgeFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-report-card')
  async createReportCard(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createReportCardReq,
  ) {
    const { success, reportCardCreated } =
      await this.adminService.createReportCard(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.reportCardCreateSuccess,
        reportCardCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failToCreateReportCard,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-report-card/:id')
  async updateReportCard(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateReportCardReq,
    @Param('id') id,
  ) {
    const { updatedReportCard, success } =
      await this.adminService.updateReportCardProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedReportCardSuccess,
        status: HttpStatus.OK,
        updatedReportCard,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingReportCardFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-subject')
  async createSubject(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createSubjectReq,
  ) {
    const { success, subjectCreated } = await this.adminService.createSubject(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminErrors.subjectCreateSuccess,
        subjectCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failToCreateSubject,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-chapter/:id')
  async updateChapter(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateChapterReq,
    @Param('id') id,
  ) {
    const { updatedChapter, success } =
      await this.adminService.updateChapterProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedChapterSuccess,
        status: HttpStatus.OK,
        updatedChapter,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingChapterFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-setting/:id')
  async updateSetting(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateSettingReq,
    @Param('id') id,
  ) {
    const { updatedSetting, success } = await this.adminService.updateSetting(
      id,
      {
        ...req.body,
      },
    );

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedSettingSuccess,
        status: HttpStatus.OK,
        updatedSetting,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingSettingFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('user-setting')
  async getUserSetting(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    @Query() params,
  ) {
    const options: IPaginationOptions = { limit, page };
    const users = await this.adminService.getUserSetting(params.id, options);

    resp.json({
      status: HttpStatus.OK,
      message: adminMessages.userSettingFetchSuccess,
      users: users.items,
      meta: users.meta,
    });
  }

  @Post('bulk-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: function (req, file, cb) {
          cb(null, Date.now() + '.xlsx');
        },
      }),
    }),
  )
  async bulkUpload(
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) resp: Response,
    @Query() params: bulkRegistrationReq,
  ) {
    const { success, files } = await this.adminService.BulkRegistration(
      params,
      file,
    );
    if (success) {
      resp.json({
        status: HttpStatus.OK,
        file: files,
      });
    }
  }

  @Post('create-class')
  async createClass(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createClassReq,
  ) {
    const { success, classCreated } = await this.adminService.createClass(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.classCreateSuccess,
        classCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminMessages.failToCreateClass,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('booked-class/:id')
  @UseMiddleware('sessionGuard')
  async bookedClass(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    //@Param('id') id,
  ) {
    const {
      params: { id },
      body: { user },
    } = req;

    const { success, bookedClass } = await this.adminService.bookedClass({
      classId: `${id}`,
      user,
    });
    //console.log(studentId.id)
    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.bookedClassSuccess,
        bookedClass,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminMessages.failToBookedClass,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('book-attendees/:id')
  async bookAttendees(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: bookAttendeesReq,
  ) {
    const {
      params: { id },
      body: { user },
    } = req;
    const { success, bookAttendees } = await this.adminService.bookAttendees({
      classId: `${id}`,
      user,
    });

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.bookAttendeesSuccess,
        bookAttendees,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminMessages.failToCreateAttendees,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('bulk-email')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: function (req, file, cb) {
          cb(null, Date.now() + '.xlsx');
        },
      }),
    }),
  )
  async bulkEmail(
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) resp: Response,
    @Query() params: bulkEmailReq,
  ) {
    const { success, files } = await this.adminService.BulkEmail(params, file);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        file: files,
      });
    }
  }

  @Post('create-email-template')
  async createEmailTemplate(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createEmailTemplateReq,
  ) {
    const { success, emailTemplateCreated } =
      await this.adminService.createEmailTemplate(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminErrors.emailCreateSuccess,
        emailTemplateCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failToCreateEmail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-email-template/:id')
  async updateEmailTemplate(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateEmailTemplateReq,
    @Param('id') id,
  ) {
    const { updatedEmailTemplate, success } =
      await this.adminService.updateEmailTemplate(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: adminMessages.updatedEmailSuccess,
        status: HttpStatus.OK,
        updatedEmailTemplate,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.updatingEmailFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('email-template/:id?')
  async getEmailTemplate(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('id') templateId,
  ) {
    const templates: EmailTemplate = await this.adminService.getEmailTemplate(
      templateId,
    );

    resp.json({
      status: HttpStatus.OK,
      message: adminMessages.emailTemplateFetchSuccess,
      templates: templates,
    });
  }

  @Post('add-banner')
  async addBanner(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: AddBanner,
  ) {
    const { success, data } = await this.adminService.addBanner(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.bannerAdded,
        data,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failToAddBanner,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-banner')
  async updateBanner(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: UpdateBanner,
  ) {
    const { success, data } = await this.adminService.updateBanner(req.body);

    if (success) {
      resp.json({
        success,
        message: adminMessages.bannerUpdated,
        status: HttpStatus.OK,
        data,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failedToUpdateBanner,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-banners')
  async getBanners(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const { success, data } = await this.adminService.getBanners();

    if (success) {
      resp.json({
        success,
        message: adminMessages.bannerFetched,
        status: HttpStatus.OK,
        data,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.failedToFetchBanner,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
