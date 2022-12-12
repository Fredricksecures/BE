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
} from 'src/dto/admin.dto';
import { AdminService } from '../services/admin.service';
import { UserTypes } from 'src/enums';
import { Request, Response } from 'express';
import { adminErrors, adminMessages } from 'src/constants';

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
  async getUsers(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() params,
  ) {
    const users = await this.adminService.getStudents(params.parentId);
    resp.json({
      status: HttpStatus.OK,
      message: adminMessages.studentFetchSuccess,
      users,
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

  @Patch('update-customer-agent/:id')
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
  
  @Get('get-customer-agents')
  async getCustomers(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const users = await this.adminService.getCustomers();
    resp.json({
      status: HttpStatus.OK,
      message: adminMessages.customerFetchSuccess,
      users,
    });
  }
}
