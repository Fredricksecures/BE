import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { COUNTRY_SEED, learningPackages, utilityErrors } from '../constants';
import { DeviceTypes } from '../enums';
import { Device } from 'src/entities/device.entity';
import { Country } from 'src/entities/country.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';

@Injectable()
export class UtilitySeeder {
  constructor(
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(Country) private countryRepo: Repository<Country>, // @InjectRepository(LearningPackage) // private learningPackageRepo: Repository<LearningPackage>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedCountries();
    await this.seedDevices();
    // await this.seedPackages();
  }

  async seedCountries() {
    //* find out if default user(s) exist
    const preSavedcountries = await this.countryRepo.find({});

    if (preSavedcountries.length === 0) {
      console.log('seeding Countries...............🌍🌎🌏');

      let createdCountries: Country,
        savedCountries: Country[] = [];

      Object.keys(COUNTRY_SEED).map((k) => {
        createdCountries = this.countryRepo.create({
          name: k,
          supported: COUNTRY_SEED[k]?.supported,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        savedCountries.push(createdCountries);
      });

      try {
        savedCountries = await this.countryRepo.save(savedCountries);
      } catch (e) {
        Logger.error(utilityErrors.seedCountries + e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: utilityErrors.seedCountries + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      console.log(
        '🚀 ~ file: seeder.service.ts ~ line 85 ~ SeederService ~ seedClasses',
        savedCountries,
      );
      return savedCountries[0];
    } else return preSavedcountries[0];
  }

  async seedDevices() {
    const preSavedDevices = await this.deviceRepo.find({});

    if (preSavedDevices.length === 0) {
      console.log('seeding Devices...............📱💻');

      let createdDevice: Device,
        savedDevices: Device[] = [];

      Object.keys(DeviceTypes).map((k) => {
        createdDevice = this.deviceRepo.create({
          type: k,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        savedDevices.push(createdDevice);
      });

      try {
        savedDevices = await this.deviceRepo.save(savedDevices);
      } catch (e) {
        Logger.error(utilityErrors.seedDevices + e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: utilityErrors.seedDevices + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      console.log(
        '🚀 ~ file: seeder.service.ts ~ line 85 ~ SeederService ~ seedDevices',
        savedDevices,
      );

      return savedDevices[0];
    } else return preSavedDevices[0];
  }

  async seedPackages() {
    // const preSavedPackages = await this.learningPackageRepo.find({});
    // if (preSavedPackages.length === 0) {
    //   console.log('seeding learning packages...............📚📖🏫');
    //   let createdPackage: LearningPackage,
    //     savedPackages: LearningPackage[] = [];
    //   Object.keys(learningPackages).map((k) => {
    //     createdPackage = this.learningPackageRepo.create({
    //       name: learningPackages[k].name,
    //       type: learningPackages[k].type,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     });
    //     savedPackages.push(createdPackage);
    //   });
    //   try {
    //     savedPackages = await this.learningPackageRepo.save(savedPackages);
    //   } catch (e) {
    //     Logger.error(utilityErrors.seedPackages + e);
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.NOT_IMPLEMENTED,
    //         error: utilityErrors.seedPackages + e,
    //       },
    //       HttpStatus.NOT_IMPLEMENTED,
    //     );
    //   }
    //   console.log(
    //     '🚀 ~ file: seeder.service.ts ~ line 85 ~ SeederService ~ seedLearningPackages',
    //     savedPackages,
    //   );
    //   return savedPackages[0];
    // } else return preSavedPackages[0];
  }
}
