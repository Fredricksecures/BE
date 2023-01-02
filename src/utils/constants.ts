import { config } from 'dotenv';
import { DeviceTypes, Genders, PackageTypes, UserTypes } from './enums';
import { JwtModule } from '@nestjs/jwt';
import { Device } from '../entities/device.entity';
import { CountryList } from '../entities/countryList.entity';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { Parent } from '../entities/parent.entity';
import { Session } from '../entities/session.entity';
import { LearningPackage } from '../entities/learningPackage.entity';
import { Subscription } from '../entities/subscription.entity';
import { CustomerCare } from '../entities/customerCare.entity';
import { Invoice } from '../entities/invoice.entity';
import { Admin } from '../entities/admin.entity';
import { Subject } from '../entities/subject.entity';
import { Lesson } from '../entities/lesson.entity';
import { Material } from '../entities/material.entity';
import { Chapter } from '../entities/chapter.entity';
import { Test } from '../entities/test.entity';
import { Class } from '../entities/class.entity';
import { ReportCard } from '../entities/reportCard.entity';
import { Leaderboard } from '../entities/leaderboard.entity';
import { Badge } from '../entities/badges.entity';
import { MockTest } from '../entities/mockTest.entity';
import { Review } from 'src/entities/review.entity';
import { Settings } from 'src/entities/settings.entity';

config();

const { JWT_SECRET, JWT_EXPIRATION_TIME } = process.env;

//* CONFIGS_________________________________________

export const jwtConfig = JwtModule.register({
  secret: JWT_SECRET,
  signOptions: { expiresIn: `${JWT_EXPIRATION_TIME}` },
});

export const ModuleConfigs = {
  app: {
    entities: [
      // User,
      // Student,
      // Parent,
      // Device,
      // CountryList,
      // Session,
      // LearningPackage,
      Subscription,
      CustomerCare,
      Invoice,
      Admin,
      Subject,
      Lesson,
      Material,
      Chapter,
      Test,
      Class,
      Student,
      ReportCard,
      Leaderboard,
      Badge,
      MockTest,
      Review,
      Settings
    ],
  },
  utility: {
    entities: [CountryList, LearningPackage, Device],
  },
  auth: {
    entities: [
      User,
      Student,
      Parent,
      Device,
      CountryList,
      Session,
      LearningPackage,
      Subscription,
      Settings
    ],
  },
  admin: {
    entities: [
      User,
      Session,
      Student,
      Parent,
      CustomerCare,
      Device,
      CountryList,
      Admin,
      LearningPackage,
      Chapter,
      Lesson,
      Subject,
      Test,
      ReportCard,
      Badge,
      MockTest,
      Class,
      Settings
    ],
  },
  subscription: {
    entities: [Subscription, LearningPackage, Invoice],
  },
  content: {
    entities: [
      Chapter,
      Lesson,
      Subject,
      LearningPackage,
      Test,
      Student,
      ReportCard,
      Leaderboard,
      Badge,
      MockTest,
      Class,
      Review
    ],
  },
  classroom: {
    entities: [
      Class,
      
    ],
  },
  user: {
    entities: [
      User,
      Student,
      Parent,
      Device,
      CountryList,
      Session,
      LearningPackage,
      Subscription,
      Settings
    ],
  },
};

export const GET_ALL_ENTITIES = () => [
  ...new Set(
    [].concat.apply(
      [],
      Object.keys(ModuleConfigs).map((key) =>
        [].concat.apply([], ModuleConfigs[key].entities),
      ),
    ),
  ),
];

//* LEARNING PACKAGES_______________________________________
export const learningPackages = {
  RECEPTION: { name: 'RECEPTION', type: PackageTypes.PRE_SCHOOL, price: 1748 },

  GRADE_1: { name: 'GRADE_1', type: PackageTypes.PRIMARY_SCHOOL, price: 2900 },
  GRADE_2: { name: 'GRADE_2', type: PackageTypes.PRIMARY_SCHOOL, price: 4638 },
  GRADE_3: { name: 'GRADE_3', type: PackageTypes.PRIMARY_SCHOOL, price: 5301 },
  GRADE_4: { name: 'GRADE_4', type: PackageTypes.PRIMARY_SCHOOL, price: 8882 },
  GRADE_5: { name: 'GRADE_5', type: PackageTypes.PRIMARY_SCHOOL, price: 8212 },
  GRADE_6: { name: 'GRADE_6', type: PackageTypes.PRIMARY_SCHOOL, price: 3947 },

  LANGUAGES: {
    name: 'NIGERIAN_LANGUAGES',
    type: PackageTypes.LANGUAGES,
    price: 1570,
  },

  BRITISH: {
    name: 'BRITISH',
    type: PackageTypes.SECONDARY_SCHOOL,
    price: 4804,
  },
  CATHOLIC: {
    name: 'CATHOLIC',
    type: PackageTypes.SECONDARY_SCHOOL,
    price: 7157,
  },
  MILITARY: {
    name: 'MILITARY',
    type: PackageTypes.SECONDARY_SCHOOL,
    price: 5590,
  },
  NATIONAL: {
    name: 'NATIONAL',
    type: PackageTypes.SECONDARY_SCHOOL,
    price: 1158,
  },
};

//* SEEDS____________________________________________
export const USER_SEED: Array<{}> = [
  {
    firstName: 'Russell',
    lastName: 'Emekoba',
    gender: Genders.MALE,
    email: 'rjemekoba@gmail.com',
    password: 'Password1$',
    type: UserTypes.PARENT,
    phoneNumber: '08076607130',
    deviceId: '2',
    dateOfBirth: '00/01/22',
  },
  {
    firstName: 'Akram',
    lastName: 'Mukasa',
    gender: Genders.MALE,
    email: 'akram.teesas@gmail.com',
    password: 'Password1$',
    type: UserTypes.PARENT,
    phoneNumber: '08076607130',
    deviceId: '2',
    dateOfBirth: '00/01/22',
  },
];

export const DEVICE_SEED = {
  type: DeviceTypes.WEB,
};

export const COUNTRY_SEED: {} = {
  Afghanistan: { priceRate: 887 },
  Albania: { priceRate: 498 },
  Algeria: { priceRate: 804 },
  'American Samoa': { priceRate: 605 },
  Andorra: { priceRate: 458 },
  Angola: { priceRate: 780 },
  Anguilla: { priceRate: 232 },
  Antarctica: { priceRate: 197 },
  'Antigua and Barbuda': { priceRate: 799 },
  Argentina: { priceRate: 367 },
  Armenia: { priceRate: 306 },
  Aruba: { priceRate: 803 },
  Australia: { priceRate: 508 },
  Austria: { priceRate: 481 },
  Azerbaijan: { priceRate: 756 },
  'Bahamas (the)': { priceRate: 470 },
  Bahrain: { priceRate: 794 },
  Bangladesh: { priceRate: 117 },
  Barbados: { priceRate: 205 },
  Belarus: { priceRate: 131 },
  Belgium: { priceRate: 252 },
  Belize: { priceRate: 301 },
  Benin: { priceRate: 694 },
  Bermuda: { priceRate: 702 },
  Bhutan: { priceRate: 379 },
  'Bolivia (Plurinational State of)': { priceRate: 546 },
  'Bonaire, Sint Eustatius and Saba': { priceRate: 852 },
  'Bosnia and Herzegovina': { priceRate: 313 },
  Botswana: { priceRate: 885 },
  'Bouvet Island': { priceRate: 543 },
  Brazil: { priceRate: 793 },
  'British Indian Ocean Territory (the)': { priceRate: 124 },
  'Brunei Darussalam': { priceRate: 338 },
  Bulgaria: { priceRate: 105 },
  'Burkina Faso': { priceRate: 642 },
  Burundi: { priceRate: 347 },
  'Cabo Verde': { priceRate: 629 },
  Cambodia: { priceRate: 108 },
  Cameroon: { priceRate: 185 },
  Canada: { priceRate: 775 },
  'Cayman Islands (the)': { priceRate: 541 },
  'Central African Republic (the)': { priceRate: 285 },
  Chad: { priceRate: 215 },
  Chile: { priceRate: 405 },
  China: { priceRate: 474 },
  'Christmas Island': { priceRate: 649 },
  'Cocos (Keeling) Islands (the)': { priceRate: 725 },
  Colombia: { priceRate: 693 },
  'Comoros (the)': { priceRate: 638 },
  'Congo (the Democratic Republic of the)': { priceRate: 163 },
  'Congo (the)': { priceRate: 599 },
  'Cook Islands (the)': { priceRate: 179 },
  'Costa Rica': { priceRate: 670 },
  Croatia: { priceRate: 593 },
  Cuba: { priceRate: 848 },
  Curaçao: { priceRate: 738 },
  Cyprus: { priceRate: 560 },
  Czechia: { priceRate: 124 },
  "Côte d'Ivoire": { priceRate: 622 },
  Denmark: { priceRate: 589 },
  Djibouti: { priceRate: 565 },
  Dominica: { priceRate: 248 },
  'Dominican Republic (the)': { priceRate: 832 },
  Ecuador: { priceRate: 426 },
  Egypt: { priceRate: 142 },
  'El Salvador': { priceRate: 529 },
  'Equatorial Guinea': { priceRate: 781 },
  Eritrea: { priceRate: 338 },
  Estonia: { priceRate: 441 },
  Eswatini: { priceRate: 442 },
  Ethiopia: { priceRate: 242 },
  'Falkland Islands (the) [Malvinas]': { priceRate: 356 },
  'Faroe Islands (the)': { priceRate: 502 },
  Fiji: { priceRate: 626 },
  Finland: { priceRate: 603 },
  France: { priceRate: 516 },
  'French Guiana': { priceRate: 532 },
  'French Polynesia': { priceRate: 207 },
  'French Southern Territories (the)': { priceRate: 820 },
  Gabon: { priceRate: 624 },
  'Gambia (the)': { priceRate: 857 },
  Georgia: { priceRate: 252 },
  Germany: { priceRate: 834 },
  Ghana: { priceRate: 853 },
  Gibraltar: { priceRate: 554 },
  Greece: { priceRate: 631 },
  Greenland: { priceRate: 581 },
  Grenada: { priceRate: 422 },
  Guadeloupe: { priceRate: 421 },
  Guam: { priceRate: 519 },
  Guatemala: { priceRate: 654 },
  Guernsey: { priceRate: 795 },
  Guinea: { priceRate: 648 },
  'Guinea-Bissau': { priceRate: 143 },
  Guyana: { priceRate: 686 },
  Haiti: { priceRate: 210 },
  'Heard Island and McDonald Islands': { priceRate: 782 },
  'Holy See (the)': { priceRate: 277 },
  Honduras: { priceRate: 613 },
  'Hong Kong': { priceRate: 888 },
  Hungary: { priceRate: 151 },
  Iceland: { priceRate: 659 },
  India: { priceRate: 667 },
  Indonesia: { priceRate: 168 },
  'Iran (Islamic Republic of)': { priceRate: 160 },
  Iraq: { priceRate: 528 },
  Ireland: { priceRate: 113 },
  'Isle of Man': { priceRate: 679 },
  Israel: { priceRate: 314 },
  Italy: { priceRate: 350 },
  Jamaica: { priceRate: 500 },
  Japan: { priceRate: 843 },
  Jersey: { priceRate: 573 },
  Jordan: { priceRate: 425 },
  Kazakhstan: { priceRate: 568 },
  Kenya: { supported: true, priceRate: 148 },
  Kiribati: { priceRate: 233 },
  "Korea (the Democratic People's Republic of)": { priceRate: 174 },
  'Korea (the Republic of)': { priceRate: 205 },
  Kuwait: { priceRate: 737 },
  Kyrgyzstan: { priceRate: 461 },
  "Lao People's Democratic Republic (the)": { priceRate: 104 },
  Latvia: { priceRate: 523 },
  Lebanon: { priceRate: 870 },
  Lesotho: { priceRate: 823 },
  Liberia: { priceRate: 320 },
  Libya: { priceRate: 378 },
  Liechtenstein: { priceRate: 336 },
  Lithuania: { priceRate: 475 },
  Luxembourg: { priceRate: 326 },
  Macao: { priceRate: 343 },
  Madagascar: { priceRate: 487 },
  Malawi: { priceRate: 880 },
  Malaysia: { priceRate: 739 },
  Maldives: { priceRate: 854 },
  Mali: { priceRate: 149 },
  Malta: { priceRate: 809 },
  'Marshall Islands (the)': { priceRate: 839 },
  Martinique: { priceRate: 895 },
  Mauritania: { priceRate: 808 },
  Mauritius: { priceRate: 490 },
  Mayotte: { priceRate: 701 },
  Mexico: { priceRate: 717 },
  'Micronesia (Federated States of)': { priceRate: 587 },
  'Moldova (the Republic of)': { priceRate: 424 },
  Monaco: { priceRate: 597 },
  Mongolia: { priceRate: 398 },
  Montenegro: { priceRate: 121 },
  Montserrat: { priceRate: 210 },
  Morocco: { priceRate: 873 },
  Mozambique: { priceRate: 782 },
  Myanmar: { priceRate: 109 },
  Namibia: { priceRate: 297 },
  Nauru: { priceRate: 104 },
  Nepal: { priceRate: 892 },
  'Netherlands (the)': { priceRate: 585 },
  'New Caledonia': { priceRate: 459 },
  'New Zealand': { priceRate: 143 },
  Nicaragua: { priceRate: 583 },
  'Niger (the)': { priceRate: 381 },
  Nigeria: { supported: true, priceRate: 559 },
  Niue: { priceRate: 190 },
  'Norfolk Island': { priceRate: 249 },
  'Northern Mariana Islands (the)': { priceRate: 573 },
  Norway: { priceRate: 676 },
  Oman: { priceRate: 190 },
  Pakistan: { priceRate: 174 },
  Palau: { priceRate: 722 },
  'Palestine, State of': { priceRate: 224 },
  Panama: { priceRate: 828 },
  'Papua New Guinea': { priceRate: 358 },
  Paraguay: { priceRate: 236 },
  Peru: { priceRate: 870 },
  'Philippines (the)': { priceRate: 891 },
  Pitcairn: { priceRate: 178 },
  Poland: { priceRate: 212 },
  Portugal: { priceRate: 261 },
  'Puerto Rico': { priceRate: 353 },
  Qatar: { priceRate: 307 },
  'Republic of North Macedonia': { priceRate: 769 },
  Romania: { priceRate: 515 },
  'Russian Federation (the)': { priceRate: 337 },
  Rwanda: { priceRate: 673 },
  Réunion: { priceRate: 786 },
  'Saint Barthélemy': { priceRate: 451 },
  'Saint Helena, Ascension and Tristan da Cunha': { priceRate: 230 },
  'Saint Kitts and Nevis': { priceRate: 737 },
  'Saint Lucia': { priceRate: 743 },
  'Saint Martin (French part)': { priceRate: 193 },
  'Saint Pierre and Miquelon': { priceRate: 402 },
  'Saint Vincent and the Grenadines': { priceRate: 179 },
  Samoa: { priceRate: 328 },
  'San Marino': { priceRate: 496 },
  'Sao Tome and Principe': { priceRate: 455 },
  'Saudi Arabia': { priceRate: 691 },
  Senegal: { priceRate: 313 },
  Serbia: { priceRate: 144 },
  Seychelles: { priceRate: 572 },
  'Sierra Leone': { priceRate: 195 },
  Singapore: { priceRate: 623 },
  'Sint Maarten (Dutch part)': { priceRate: 381 },
  Slovakia: { priceRate: 646 },
  Slovenia: { priceRate: 691 },
  'Solomon Islands': { priceRate: 889 },
  Somalia: { priceRate: 331 },
  'South Africa': { priceRate: 781 },
  'South Georgia and the South Sandwich Islands': { priceRate: 488 },
  'South Sudan': { priceRate: 183 },
  Spain: { priceRate: 772 },
  'Sri Lanka': { priceRate: 131 },
  'Sudan (the)': { priceRate: 468 },
  Suriname: { priceRate: 357 },
  'Svalbard and Jan Mayen': { priceRate: 236 },
  Sweden: { priceRate: 681 },
  Switzerland: { priceRate: 246 },
  'Syrian Arab Republic': { priceRate: 675 },
  Taiwan: { priceRate: 141 },
  Tajikistan: { priceRate: 273 },
  'Tanzania, United Republic of': { priceRate: 118 },
  Thailand: { priceRate: 771 },
  'Timor-Leste': { priceRate: 891 },
  Togo: { priceRate: 491 },
  Tokelau: { priceRate: 331 },
  Tonga: { priceRate: 794 },
  'Trinidad and Tobago': { priceRate: 411 },
  Tunisia: { priceRate: 752 },
  Turkey: { priceRate: 681 },
  Turkmenistan: { priceRate: 489 },
  'Turks and Caicos Islands (the)': { priceRate: 455 },
  Tuvalu: { priceRate: 491 },
  Uganda: { priceRate: 157 },
  Ukraine: { priceRate: 171 },
  'United Arab Emirates (the)': { priceRate: 778 },
  'United Kingdom of Great Britain and Northern Ireland (the)': {
    priceRate: 200,
  },
  'United States Minor Outlying Islands (the)': { priceRate: 447 },
  'United States of America (the)': { priceRate: 231 },
  Uruguay: { priceRate: 572 },
  Uzbekistan: { priceRate: 164 },
  Vanuatu: { priceRate: 119 },
  'Venezuela (Bolivarian Republic of)': { priceRate: 145 },
  'Viet Nam': { priceRate: 739 },
  'Virgin Islands (British)': { priceRate: 466 },
  'Virgin Islands (U.S.)': { priceRate: 544 },
  'Wallis and Futuna': { priceRate: 381 },
  'Western Sahara': { priceRate: 602 },
  Yemen: { priceRate: 708 },
  Zambia: { priceRate: 344 },
  Zimbabwe: { priceRate: 718 },
  'Åland Islands': { priceRate: 577 },
};
