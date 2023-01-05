import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { utilityErrors } from 'src/utils/messages';
import { CountryList } from 'src/entities/countryList.entity';
import { Device } from 'src/entities/device.entity';
import { Repository } from 'typeorm';
import Logger from 'src/utils/logger';
import { LearningPackage } from 'src/entities/learningPackage.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UtilityService {
  constructor(
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(CountryList)
    private countryLRepo: Repository<CountryList>,
    @InjectRepository(LearningPackage)
    private lPLRepo: Repository<LearningPackage>,
  ) {}

  async updatePriceRate(countryId) {}

  async getCountryList(countryId: string) {
    let country: CountryList;
    console.log(countryId)
    try {
      country = await this.countryLRepo.findOne({
        where: {
          id: countryId,
          supported: true,
        },
      });
      // console.log(country)
      // console.log(countryId)
    } catch (exp) {
      Logger.error(utilityErrors.getCountryList + exp);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: utilityErrors.getCountryList + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return country;
  }

  async getDevice(deviceId: string) {
    let foundDevice: Device;

    try {
      foundDevice = await this.deviceRepo.findOne({
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

    return foundDevice;
  }

  async getLearningPackages(
    packageId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<LearningPackage>> {
    let foundPackages;
    try {
      foundPackages =
        packageId == 'undefined'
          ? await this.lPLRepo.createQueryBuilder('LearningPackage')
          : await this.lPLRepo
              .createQueryBuilder('LearningPackage')
              .where('LearningPackage.id = :packageId', { packageId });

      return paginate<LearningPackage>(foundPackages, options);
    } catch (exp) {
      Logger.error(utilityErrors.getPackageList + exp);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: utilityErrors.getPackageList + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getCountries(
    supported: boolean,
    options: IPaginationOptions,
  ): Promise<Pagination<CountryList>> {
    let foundCountries;
    try {
      foundCountries =
        supported == undefined
          ? await this.countryLRepo.createQueryBuilder('CountryList')
          : await this.countryLRepo
              .createQueryBuilder('CountryList')
              .where('CountryList.supported = true');

      return paginate<CountryList>(foundCountries, options);
    } catch (exp) {
      Logger.error(utilityErrors.getCountryList + exp);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: utilityErrors.getCountryList + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
}
