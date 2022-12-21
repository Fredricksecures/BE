import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { utilityErrors } from 'src/utils/messages';
import { CountryList } from 'src/entities/countryList.entity';
import { Device } from 'src/entities/device.entity';
import { Repository } from 'typeorm';
import Logger from 'src/utils/logger';
import { LearningPackage } from 'src/entities/learningPackage.entity';

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

    try {
      country = await this.countryLRepo.findOne({
        where: {
          id: countryId,
          supported: true,
        },
      });
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

  async getLearningPackages(
    packageId: string,
  ): Promise<Device | Array<Device>> {
    let foundPackages: Device | Array<Device>;

    console.log(packageId);

    try {
      foundPackages =
        packageId == undefined
          ? await this.lPLRepo.findOne({
              where: {
                id: packageId,
              },
            })
          : await this.lPLRepo.find({});

      return foundPackages;
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
}
