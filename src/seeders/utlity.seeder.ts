import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { utilityErrors } from '../utils/messages';
import { COUNTRY_SEED, learningPackages } from '../utils/constants';
import { CountryList } from 'src/entities/countryList.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';

@Injectable()
export class UtilitySeeder {
  constructor(
    @InjectRepository(LearningPackage)
    private lPLRepo: Repository<LearningPackage>,
    @InjectRepository(CountryList) private countryRepo: Repository<CountryList>, // @InjectRepository(LearningPackage) // private learningPackageRepo: Repository<LearningPackage>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedCountries();
    await this.seedPackages();
  }

  async seedCountries() {
    //* find out if default user(s) exist
    const preSavedcountries = await this.countryRepo.find({});

    if (preSavedcountries.length === 0) {
      console.log('seeding Countries...............🌍🌎🌏');

      let createdCountries: CountryList,
        savedCountries: CountryList[] = [];

      Object.keys(COUNTRY_SEED).map((k) => {
        createdCountries = this.countryRepo.create({
          name: k,
          priceRate: COUNTRY_SEED[k]?.priceRate,
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

  async seedPackages() {
    const packageList = await this.lPLRepo.find({});

    if (packageList.length === 0) {
      console.log('seeding learning package list...............📚📖🏫');
      let createdPackage: LearningPackage,
        savedPackages: LearningPackage[] = [];

      Object.keys(learningPackages).map((k) => {
        createdPackage = this.lPLRepo.create({
          name: learningPackages[k].name,
          type: learningPackages[k].type,
          price: learningPackages[k].price,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        savedPackages.push(createdPackage);
      });

      console.log(savedPackages);

      try {
        savedPackages = await this.lPLRepo.save(savedPackages);
      } catch (e) {
        Logger.error(utilityErrors.seedPackages + e);

        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: utilityErrors.seedPackages + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      console.log(
        '🚀 ~ file: seeder.service.ts ~ line 85 ~ SeederService ~ seedLearningPackages',
        savedPackages,
      );

      return savedPackages[0];
    } else return packageList[0];
  }
}
