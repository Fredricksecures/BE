import { config } from 'dotenv';
import { DeviceTypes, UserTypes } from './enums';
import { JwtModule } from '@nestjs/jwt';
import { Device } from './entities/device.entity';
import { Country } from './entities/country.entity';
import { User } from './entities/user.entity';
import { Student } from './entities/student.entity';
import { Parent } from './entities/parent.entity';
import { Session } from './entities/session.entity';

config();

const { JWT_SECRET, JWT_EXPIRATION_TIME } = process.env;

//* CONFIGS_________________________________________

export const jwtConfig = JwtModule.register({
  secret: JWT_SECRET,
  signOptions: { expiresIn: `${JWT_EXPIRATION_TIME}` },
});

export const ModuleConfigs = {
  app: {
    entities: [],
  },
  utility: {
    entities: [Device, Country],
  },
  auth: {
    entities: [User, Student, Parent, Device, Country, Session],
  },
  admin: {
    entities: [User, Session],
  },
};

export const GET_ALL_ENTITIES = () => [
  ...new Set(
    [].concat.apply(
      [],
      Object.keys(ModuleConfigs).map((key, val) =>
        [].concat.apply([], ModuleConfigs[key].entities),
      ),
    ),
  ),
];

//* MESSAGES_______________________________________

export const utlityMessages = {
  devices: 'Fetched devices successfully --------- ',
  countries: 'Fetched countries successfully --------- ',
};

export const utilityErrors = {
  seedDevices: 'failed to seed devices --------- ',
  seedCountries: 'failed to seed countries --------- ',
  getCountry: 'failed to fecth country info --------- ',
  getDevice: 'failed to fecth device info --------- ',
};

export const authMessages = {
  countries: 'all countries retrieved successfully --------- ',
  endpoints: 'authentication endpoints retrieved successfully --------- ',
  userCreated: 'user created successfully --------- ',
  login: 'login successful --------- ',
  teacherCreated: 'Teacher profile created successfully --------- ',
  profileUpdateSuccessful: 'profile updated successfully --------- ',
  passwordEmailSent: 'reset email sent successfully --------- ',
  pwordReset: 'Password reset successfully --------- ',
};

export const adminMessages = {
  fetchSessionFailed: 'Failed to fetch user sessions -------',
  fetchSessionSuccess: 'User sessions fetched successfully -------',
  userNotFoundWithId: 'No user found with this id. --------- ',
  checkingUser: 'error while fetching user. --------- ',
  checkingSession: 'error while fetching session. --------- ',
  sessionNotFoundWithId: 'no session found for this parent. --------- ',
  noParentFound: 'parent not found with this user id. --------- ',
};

export const authErrors = {
  noMockDevice: 'could not find mock device for seeder --------- ',
  createSession: 'could not create a new session for user --------- ',
  noMockCountry: 'could not find mock country for seeder --------- ',
  saveUser: 'could not save new user --------- ',
  savedCountries: 'could not save new country to db --------- ',
  createdTeacher: 'could not create new teacher --------- ',
  savedTeacherToUser: 'could not save new teacher id to user --------- ',
  createdSchool: 'could not create new school --------- ',
  savedSchoolToUser: 'could not save new school id to user --------- ',
  createdParent: 'could not create new parent --------- ',
  createdClass: 'could not create new class --------- ',
  createdDevice: 'could not create new device --------- ',
  foundClass: 'could not find class of specified id --------- ',
  savedParentToUser: 'could not save new parent id to user --------- ',
  createdStudent: 'could not create new student --------- ',
  savedStudentToUser: 'could not save new student id to user --------- ',
  savedEntranceExamSubscription:
    'could not create new entrance exam subscription --------- ',
  dupPNQuery: 'query for duplicate phone number failed --------- ',
  dupEmailQuery: 'query for duplicate email failed --------- ',
  tokenCreate: 'could not create token --------- ',
  userTokenUpdate: 'could not update user token --------- ',
  checkingEmail: 'Error querying for matching emails --------- ',
  checkingPassword: 'Error querying for matching passwords --------- ',
  emailNotFound: 'user with specified email not found --------- ',
  invalidPassword: 'password invalid for email provided --------- ',
  loginFailed: 'login failed --------- ',
  invalidNotificationInformation:
    'no email or phone number recieved --------- ',
  invalidToken: 'Invalid Token --------- ',
  noTokenIdMatch: 'could not match user to decoded id --------- ',
  noAuthTokenPassed: 'no authorization token passed --------- ',
  noCookieTokenPassed: 'no token passed via cookies --------- ',
  invalidEmail: 'no user with given email --------- ',
  savePin: 'could not save user reset pin --------- ',
  userNotFoundById: 'Could not find matching user of given id --------- ',
  queryById: 'Error querying user via id  --------- ',
  sameNewAndPrevPassword: 'New Password is the same as old password --------- ',
  savingNewPword: 'Error updating user password --------- ',
  findingUserWithId: 'Could not find user with given id --------- ',
};

//* SEEDS____________________________________________

export const USER_SEED = [
  {
    email: 'rjemekoba@gmail.com',
    password: 'Password1$',
    type: UserTypes.PARENT,
    phoneNumber: '08076607130',
    deviceId: '2',
  },
];

export const DEVICE_SEED = {
  type: DeviceTypes.WEB,
};

export const COUNTRY_SEED = {
  Afghanistan: {},
  Albania: {},
  Algeria: {},
  'American Samoa': {},
  Andorra: {},
  Angola: {},
  Anguilla: {},
  Antarctica: {},
  'Antigua and Barbuda': {},
  Argentina: {},
  Armenia: {},
  Aruba: {},
  Australia: {},
  Austria: {},
  Azerbaijan: {},
  'Bahamas (the)': {},
  Bahrain: {},
  Bangladesh: {},
  Barbados: {},
  Belarus: {},
  Belgium: {},
  Belize: {},
  Benin: {},
  Bermuda: {},
  Bhutan: {},
  'Bolivia (Plurinational State of)': {},
  'Bonaire, Sint Eustatius and Saba': {},
  'Bosnia and Herzegovina': {},
  Botswana: {},
  'Bouvet Island': {},
  Brazil: {},
  'British Indian Ocean Territory (the)': {},
  'Brunei Darussalam': {},
  Bulgaria: {},
  'Burkina Faso': {},
  Burundi: {},
  'Cabo Verde': {},
  Cambodia: {},
  Cameroon: {},
  Canada: {},
  'Cayman Islands (the)': {},
  'Central African Republic (the)': {},
  Chad: {},
  Chile: {},
  China: {},
  'Christmas Island': {},
  'Cocos (Keeling) Islands (the)': {},
  Colombia: {},
  'Comoros (the)': {},
  'Congo (the Democratic Republic of the)': {},
  'Congo (the)': {},
  'Cook Islands (the)': {},
  'Costa Rica': {},
  Croatia: {},
  Cuba: {},
  Curaçao: {},
  Cyprus: {},
  Czechia: {},
  "Côte d'Ivoire": {},
  Denmark: {},
  Djibouti: {},
  Dominica: {},
  'Dominican Republic (the)': {},
  Ecuador: {},
  Egypt: {},
  'El Salvador': {},
  'Equatorial Guinea': {},
  Eritrea: {},
  Estonia: {},
  Eswatini: {},
  Ethiopia: {},
  'Falkland Islands (the) [Malvinas]': {},
  'Faroe Islands (the)': {},
  Fiji: {},
  Finland: {},
  France: {},
  'French Guiana': {},
  'French Polynesia': {},
  'French Southern Territories (the)': {},
  Gabon: {},
  'Gambia (the)': {},
  Georgia: {},
  Germany: {},
  Ghana: {},
  Gibraltar: {},
  Greece: {},
  Greenland: {},
  Grenada: {},
  Guadeloupe: {},
  Guam: {},
  Guatemala: {},
  Guernsey: {},
  Guinea: {},
  'Guinea-Bissau': {},
  Guyana: {},
  Haiti: {},
  'Heard Island and McDonald Islands': {},
  'Holy See (the)': {},
  Honduras: {},
  'Hong Kong': {},
  Hungary: {},
  Iceland: {},
  India: {},
  Indonesia: {},
  'Iran (Islamic Republic of)': {},
  Iraq: {},
  Ireland: {},
  'Isle of Man': {},
  Israel: {},
  Italy: {},
  Jamaica: {},
  Japan: {},
  Jersey: {},
  Jordan: {},
  Kazakhstan: {},
  Kenya: { supported: true },
  Kiribati: {},
  "Korea (the Democratic People's Republic of)": {},
  'Korea (the Republic of)': {},
  Kuwait: {},
  Kyrgyzstan: {},
  "Lao People's Democratic Republic (the)": {},
  Latvia: {},
  Lebanon: {},
  Lesotho: {},
  Liberia: {},
  Libya: {},
  Liechtenstein: {},
  Lithuania: {},
  Luxembourg: {},
  Macao: {},
  Madagascar: {},
  Malawi: {},
  Malaysia: {},
  Maldives: {},
  Mali: {},
  Malta: {},
  'Marshall Islands (the)': {},
  Martinique: {},
  Mauritania: {},
  Mauritius: {},
  Mayotte: {},
  Mexico: {},
  'Micronesia (Federated States of)': {},
  'Moldova (the Republic of)': {},
  Monaco: {},
  Mongolia: {},
  Montenegro: {},
  Montserrat: {},
  Morocco: {},
  Mozambique: {},
  Myanmar: {},
  Namibia: {},
  Nauru: {},
  Nepal: {},
  'Netherlands (the)': {},
  'New Caledonia': {},
  'New Zealand': {},
  Nicaragua: {},
  'Niger (the)': {},
  Nigeria: { supported: true },
  Niue: {},
  'Norfolk Island': {},
  'Northern Mariana Islands (the)': {},
  Norway: {},
  Oman: {},
  Pakistan: {},
  Palau: {},
  'Palestine, State of': {},
  Panama: {},
  'Papua New Guinea': {},
  Paraguay: {},
  Peru: {},
  'Philippines (the)': {},
  Pitcairn: {},
  Poland: {},
  Portugal: {},
  'Puerto Rico': {},
  Qatar: {},
  'Republic of North Macedonia': {},
  Romania: {},
  'Russian Federation (the)': {},
  Rwanda: {},
  Réunion: {},
  'Saint Barthélemy': {},
  'Saint Helena, Ascension and Tristan da Cunha': {},
  'Saint Kitts and Nevis': {},
  'Saint Lucia': {},
  'Saint Martin (French part)': {},
  'Saint Pierre and Miquelon': {},
  'Saint Vincent and the Grenadines': {},
  Samoa: {},
  'San Marino': {},
  'Sao Tome and Principe': {},
  'Saudi Arabia': {},
  Senegal: {},
  Serbia: {},
  Seychelles: {},
  'Sierra Leone': {},
  Singapore: {},
  'Sint Maarten (Dutch part)': {},
  Slovakia: {},
  Slovenia: {},
  'Solomon Islands': {},
  Somalia: {},
  'South Africa': {},
  'South Georgia and the South Sandwich Islands': {},
  'South Sudan': {},
  Spain: {},
  'Sri Lanka': {},
  'Sudan (the)': {},
  Suriname: {},
  'Svalbard and Jan Mayen': {},
  Sweden: {},
  Switzerland: {},
  'Syrian Arab Republic': {},
  Taiwan: {},
  Tajikistan: {},
  'Tanzania, United Republic of': {},
  Thailand: {},
  'Timor-Leste': {},
  Togo: {},
  Tokelau: {},
  Tonga: {},
  'Trinidad and Tobago': {},
  Tunisia: {},
  Turkey: {},
  Turkmenistan: {},
  'Turks and Caicos Islands (the)': {},
  Tuvalu: {},
  Uganda: {},
  Ukraine: {},
  'United Arab Emirates (the)': {},
  'United Kingdom of Great Britain and Northern Ireland (the)': {},
  'United States Minor Outlying Islands (the)': {},
  'United States of America (the)': {},
  Uruguay: {},
  Uzbekistan: {},
  Vanuatu: {},
  'Venezuela (Bolivarian Republic of)': {},
  'Viet Nam': {},
  'Virgin Islands (British)': {},
  'Virgin Islands (U.S.)': {},
  'Wallis and Futuna': {},
  'Western Sahara': {},
  Yemen: {},
  Zambia: {},
  Zimbabwe: {},
  'Åland Islands': {},
};
