import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { utilityErrors } from '../../../utils/messages';
import { COUNTRY_SEED, learningPackages } from '../../../utils/constants';
import { CountryList } from 'src/modules/utility/entity/countryList.entity';
import { Subject } from 'src/modules/content/entity/subject.entity';
import { LearningPackage } from 'src/modules/utility/entity/learningPackage.entity';
import { Chapter } from 'src/modules/content/entity/chapter.entity';
import { Lesson } from 'src/modules/content/entity/lesson.entity';

@Injectable()
export class UtilitySeeder {
  constructor(
    @InjectRepository(LearningPackage)
    private lPLRepo: Repository<LearningPackage>,
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
    @InjectRepository(CountryList) private countryRepo: Repository<CountryList>,
    @InjectRepository(Chapter) private chapterRepo: Repository<Chapter>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
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
        // savedCountries,
      );
      return savedCountries[0];
    } else return preSavedcountries[0];
  }

  async seedPackages() {
    const foundPackages = await this.lPLRepo.find({});

    if (foundPackages || foundPackages.length == 0) {
      console.log('seeding Learning Packages...............📦📦📦');

      return Promise.all(
        Object.keys(learningPackages).map(async (k) => {
          const dbPKG = await this.lPLRepo.save({
            name: learningPackages[k].name,
            type: learningPackages[k].type,
            price: learningPackages[k].price,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          //? seed subjects for each package
          learningPackages[k]?.subjects?.map(async (subject) => {
            const dbSBJ = await this.subjectRepo.save({
              title: subject.title,
              learningPackage: dbPKG,
            });

            //? seed chapters for each subject
            subject?.chapters?.map(async (chapter) => {
              const dbCHPT = await this.chapterRepo.save({
                title: chapter.title,
                subject: dbSBJ,
              });

              //? seed lessons for each chapter
              chapter?.lessons?.map(async (lesson) => {
                const dbLESS = await this.lessonRepo.save({
                  title: lesson.title,
                  chapter: dbCHPT,
                });

                console.log('dbLESS', dbLESS);
              });
            });
          });

          // const pkgSubjects = learningPackages[k].subjects;

          // if (pkgSubjects != null) {
          //   let pkgSubjectDocs: Array<Subject> = [];

          //   Object.keys(pkgSubjects).map(async (sub) => {
          //     if (sub) {
          // const savedSubjectDoc = await this.subjectRepo.save({
          //   name: sub,
          //   learningPackage: pkg,
          // });

          //       const subjectLessons = learningPackages[k].subjects[sub];

          //       Object.keys;

          //       // pkgSubjectDocs.push(
          //       // this.subjectRepo.create({
          //       //   name: sub,
          //       //   learningPackage: pkg,
          //       // }),
          //       // );
          //     }
          //   });

          //   // return savedPKGs;
          // }
        }),
      ).then((res: Array<any>) => {
        console.log(
          '🚀 ~ file: seeder.service.ts ~ line 85 ~ SeederService ~ seedLearningPackages',
          res.map((e) => (e != undefined ? e : {})),
        );
      });
    }
  }
}
