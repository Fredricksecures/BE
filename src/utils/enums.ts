export enum UserTypes {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  CUSTOMERCARE = 'CUSTOMERCARE',
  DEFAULT = 'DEFAULT',
}

export enum SubscriptionStates {
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  INACTIVE = 'INACTIVE',
}

export enum DeviceTypes {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  WEB = 'WEB',
  OMOTAB = 'OMOTAB',
  UNKNOWN = 'UNKNOWN',
}

export enum OrderTypes {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
}

export enum BrowserTypes {
  CHROME = 'CHROME',
  EDGE = 'EDGE',
  SAFARI = 'SAFARI',
  UNKNOWN = 'UNKNOWN',
}

export enum OSTypes {
  WINDOWS = 'WINDOWS',
  LINUX = 'LINUX',
  MACINTOSH = 'MACINTOSH',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  OMOTAB = 'OMOTAB',
  UNKNOWN = 'UNKNOWN',
}

export enum Genders {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum PackageTypes {
  PRE_SCHOOL = 'PRE_SCHOOL',
  PRIMARY_SCHOOL = 'PRIMARY_SCHOOL',
  SECONDARY_SCHOOL = 'SECONDARY_SCHOOL',
  LEADER_IN_ME = 'LEADER_IN_ME',
  LANGUAGES = 'LANGUAGES',
}

export enum MaterialTypes {
  VIDEO = 'VIDEO',
  EBOOK = 'EBOOK',
}

export enum OnboardingStages {
  STAGE_0 = 'STAGE_0', //* basic registration. Default stage
  STAGE_1 = 'STAGE_1',
  STAGE_2 = 'STAGE_2',
  STAGE_3 = 'STAGE_3',
}

export enum institutionTypes {
  NURSERY = 'NURSERY',
  PRIMARY = 'PRIMARY',
}

export enum ClassStates {
  STARTED = 'STARTED',
  ENDED = 'ENDED',
  ONGOING = 'ONGOING',
}

export enum Subjects {
  ENGLISH = 'ENGLISH',
  SCIENCE = 'SCIENCE',
  MATHEMATICS = 'MATHEMATICS',
}

export enum ProductType {
  EBOOK = 'EBOOK',
  IMOSETAB = 'IMOSETAB',
}

export enum BannerType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export enum CorrectAnswer {
  option_a = 'option_a',
  option_b = 'option_b',
  option_c = 'option_c',
  option_d = 'option_d',
}

export enum Appearence {
  light_theme = 'Light_theme',
  dark_theme = 'Dark_theme',
  auto = 'Auto'
  
}

export enum Resolution {
  reso_480 = '480_P',
  reso_1080 = '1080_P',
  reso_4K = '4_K',
  
}
