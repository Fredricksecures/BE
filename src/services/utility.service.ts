import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { utilityErrors } from 'src/constants';
import { Country } from 'src/entities/country.entity';
import { Device } from 'src/entities/device.entity';
import Logger from 'src/utils/logger';
import { Repository } from 'typeorm';

@Injectable()
export class UtilityService {
  constructor(
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
  ) {}

  async getCountry(countryId: string) {
    let country: Country;

    try {
      country = await this.countryRepo.findOne({
        where: {
          id: countryId,
          supported: true,
        },
      });
    } catch (exp) {
      Logger.error(utilityErrors.getCountry + exp);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: utilityErrors.getCountry + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return country;
  }

  async getDevice(deviceId: string) {
    let mockDevice: Device;

    try {
      mockDevice = await this.deviceRepo.findOne({
        where: {
          id: deviceId,
        },
      });
    } catch (exp) {
      Logger.error(utilityErrors.getDevice + exp);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: utilityErrors.getDevice + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return mockDevice;
  }
}
