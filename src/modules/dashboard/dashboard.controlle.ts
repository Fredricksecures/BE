import {
    Query,
    Controller,
    HttpStatus,
    Res,
    Get,
    Post,
    Req,
    Body,
    Param,
    Patch,
    HttpException,
    DefaultValuePipe,
    ParseIntPipe,
  } from '@nestjs/common';
  import {
    
  } from 'src/modules/dashboard/dto/dashboard.dto';
  import { Request, Response } from 'express';
  import { dashboardMessages, dashboardErrors } from 'src/utils/messages';
  import { DashboardService } from 'src/modules/dashboard/dashboard.service';
  import { IPaginationOptions } from 'nestjs-typeorm-paginate';
  
  @Controller('dashboard')
  export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}
    
    
    }
  