import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../../user/entity/user.entity';
import { authErrors } from '../../../utils/messages';
import { USER_SEED } from '../../../utils/constants';
import { Device } from 'src/modules/auth/entity/device.entity';
import { CountryList } from 'src/modules/utility/entity/countryList.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { Session } from 'src/modules/auth/entity/session.entity';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class AuthSeeder {
  constructor(
    private authService: AuthService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(CountryList) private countryRepo: Repository<CountryList>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  async onApplicationBootstrap() {
    //* user registers. we create a session, log the device and register the user

    const mockCountryList = await this.getMockCountryList();
    // const mockDevice = await this.getMockDevice();
    // const mockSession = await this.createMockSession(mockDevice);

    //! const mockSubscription = await this.seedSubscriptions();
    //! const mockPaymentPlan = await this.seedPaymentPlans();
    //! const mockUserRoles = await this.seedUserRoles();
    // await this.seedUsers({ mockDevice, mockCountryList, mockSession });
    //* find out if seeded user(s) already exist(s)___________________________
    const users = await this.userRepo.find({});
    if (users.length === 0) {
      this.seedUsers(USER_SEED);
    }
  }

  async createMockSession(user: User) {
    let createdSession: Session;

    const mockDevice = await this.getMockDevice();

    try {
      createdSession = await this.sessionRepo.save({
        device: mockDevice,
        portal: 'chrome',
        user,
      });

      // console.log(
      //   '🚀 ~ file: auth.seeder.ts ~ line 64 ~ AuthSeeder ~ createMockSession ~ createdSession',
      //   createdSession,
      // );
    } catch (e) {
      Logger.error(`${authErrors.createSession}--- ${e}`);

      throw new NotImplementedException(
        null,
        `${authErrors.createSession} ${e}`,
      );
    }

    return createdSession;
  }

  async getMockCountryList() {
    const mockCountries = await this.countryRepo.find({
      where: { supported: true },
    });

    if (mockCountries.length === 0) {
      Logger.error(authErrors.noMockCountryList);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.noMockCountryList,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return mockCountries[1];
  }

  async getMockDevice() {
    const mockDevices = await this.deviceRepo.find({});

    if (mockDevices.length === 0) {
      Logger.error(authErrors.noMockDevice);

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.noMockDevice,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return mockDevices[0];
  }

  async seedUsers(data) {
    Promise.all(
      data.map(async (user: any) => {
        const regResp = await this.authService.registerUser({
          // firstName: user.firstName,
          // lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          password: user.password,
          confirmPassword: user.password,
          countryId: (await this.getMockCountryList()).id.toString(),
        });

        return regResp.createdUser;
      }),
    ).then((seededUsers: User[]) => {
      console.log(seededUsers);
    });
  }
}
