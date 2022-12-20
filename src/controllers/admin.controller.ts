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
} from '@nestjs/common';
import {
  GetAllUsersSessionsReq,
  GetAllUsersSessionsRes,
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
} from 'src/dto/admin.dto';
import { AdminService } from '../services/admin.service';
import { UserTypes } from 'src/enums';
import { Request, Response } from 'express';
import { adminErrors, adminMessages } from 'src/constants';
import { Student } from 'src/entities/student.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('user-sessions')
  async getUserSessions(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() query: GetAllUsersSessionsReq,
  ) {
    const { success, sessions }: GetAllUsersSessionsRes =
      await this.adminService.getUserSessions(query);

    if (success) {
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

  @Get('end-user-sessions')
  async endUserSessions(
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

  @Get('recover-user-sessions')
  async recoverUserSessions(
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
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
    //console.log(body)
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
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

}
