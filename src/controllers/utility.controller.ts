import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UtilityService } from '../services/utility.service';
import { UtilitySeeder } from 'src/seeders/utlity.seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entities/country.entity';
import { Repository } from 'typeorm';
import { utlityMessages } from 'src/constants';
import { Device } from 'src/entities/device.entity';
import { Response, Request } from 'express';

@Controller('utility')
export class UtilityController {
  constructor(
    private readonly utilitySeeder: UtilitySeeder,
    private readonly utilityService: UtilityService,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
  ) {}

  @Get('countries')
  async getCountries(@Req() req: Request, @Res() resp: Response) {
    const { supported } = req.query;

    const countries = await this.countryRepo.find({
      ...(supported === 'true' ? { where: { supported: true } } : {}),
    });

    resp.json({
      status: HttpStatus.FOUND,
      message: utlityMessages.countries,
      countries,
    });
  }

  @Get('devices')
  async getDevices(@Req() req: Request, @Res() resp: Response) {
    const devices = await this.deviceRepo.find({});

    resp.json({
      status: HttpStatus.FOUND,
      message: utlityMessages.devices,
      devices,
    });
  }
}
