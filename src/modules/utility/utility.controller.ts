import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UtilityService } from './utility.service';
import { UtilitySeeder } from './seeder/utility';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryList } from 'src/modules/utility/entity/countryList.entity';
import { Repository } from 'typeorm';
import { utlityMessages } from 'src/utils/messages';
import { Device } from 'src/modules/auth/entity/device.entity';
import { Response, Request } from 'express';
import { LearningPackage } from './entity/learningPackage.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Controller('utility')
export class UtilityController {
  constructor(
    private readonly utilitySeeder: UtilitySeeder,
    private readonly utilityService: UtilityService,
    @InjectRepository(CountryList) private countryRepo: Repository<CountryList>,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(LearningPackage)
    private lPRepo: Repository<LearningPackage>,
  ) {}

  @Get('all-endpoints')
  async serverStatus(@Res() resp: Response) {
    const endpoints = (global as any).app
      .getHttpServer()
      ._events.request._router.stack.map((item: any) => item.route?.path)
      .filter((item: string) => item);

    resp.json({
      status: HttpStatus.FOUND,
      // message: authMessages.endpoints,
      endpoints,
    });
  }

  @Get('countries')
  async getCountries(
    @Req() req: Request,
    @Res() resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
    @Query('supported') supported,
  ) {
    const options: IPaginationOptions = { limit, page };
    const countries = await this.utilityService.getCountries(
      supported,
      options,
    );

    resp.json({
      status: HttpStatus.FOUND,
      message: utlityMessages.countries,
      countries: countries.items,
      meta: countries.meta,
    });
  }

  @Get('devices')
  async getDevices(@Req() req: Request, @Res() resp: Response) {
    const devices = await this.deviceRepo.find({});

    resp.json({
      status: HttpStatus.OK,
      message: utlityMessages.devices,
      devices,
    });
  }

  @Get('learning-packages')
  async getLPackages(
    @Req() req: Request,
    @Res() resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const id = req.query.id;
    const options: IPaginationOptions = { limit, page };
    const learningPackages = await this.utilityService.getLearningPackages(
      `${id}`,
      options,
    );

    resp.json({
      status: HttpStatus.FOUND,
      message: utlityMessages.learningPackages,
      [`package${id ? '' : 's'}`]: learningPackages.items,
      meta: learningPackages.meta,
    });
  }
}
