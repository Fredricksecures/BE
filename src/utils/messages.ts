export const utlityMessages = {
  learningPackages: 'learning packages fetched successfully',
  devices: 'Devcies successfully fetched',
  countries: 'Countries successfully fetched',
};
export const utilityErrors = {
  getPackageList: 'failed to fetch pakcage list',
  seedDevices: 'failed to seed devices ',
  seedCountries: 'failed to seed countries ',
  getCountryList: 'failed to fecth country info ',
  seedPackages: 'failed to seed learning packages ',
  getDevice: 'failed to fecth device info ',
  invalidCountry: 'invalid country id',
};

export const subscriptionMessages = {
  create: 'subscription created successfully',
  fetchSubscriptionSuccess: 'Subscriptions fetched successfully',
  fetchInvoiceHistorySuccess: 'Invoices History fetched successfully',
};
export const subscriptionError = {
  create: 'failed to create subscription',
  fetchSubscriptionFailed: 'Failed to fetch Subscriptions',
  fetchSubscriptionHistoryFailed: 'Failed to fetch Subscription history',
  fetchInvoicesFailed: 'Failed to fetch Invoices history',
  checkingSubscription: 'Error querying for finding subscriptions --',
  checkingInvoices: 'Error querying for finding invoices --',
  failedToFetchSubscriptions: 'Failed to fetch subscriptions --',
  lPLNotFound: 'could not find learning package id = ',
  savedSubscription: 'could not save new subscription',
};

export const authMessages = {
  countries: 'all countries retrieved successfully',
  endpoints: 'authentication endpoints retrieved successfully',
  userCreated: 'user created successfully',
  login: 'login successful',
  teacherCreated: 'Teacher profile created successfully',
  profileUpdateSuccessful: 'profile updated successfully',
  passwordEmailSent: 'reset email sent successfully',
  pwordReset: 'Password reset successfully',
  logout: 'Logout successfully',
  createdStudent: 'Students Created Successfully',
  studentsFetchSuccess: 'Students Fetched successfully',
};
export const authErrors = {
  noMockDevice: 'could not find mock device for seeder ',
  sessionExpired:
    'your session has expired. Login again to get a new session and token',
  studentsNotFound: 'could not find students',
  queryingParent: 'could not find parent with user id provided',

  createSession: 'could not create a new session for user ',
  noMockCountryList: 'could not find mock country for seeder ',
  saveUser: 'could not save new user ',
  savedCountries: 'could not save new country to db ',
  createdTeacher: 'could not create new teacher ',
  savedTeacherToUser: 'could not save new teacher id to user ',
  createdSchool: 'could not create new school ',
  savedSchoolToUser: 'could not save new school id to user ',
  createdParent: 'could not create new parent ',
  createdClass: 'could not create new class ',
  createdDevice: 'could not create new device ',
  foundClass: 'could not find class of specified id ',
  savedParentToUser: 'could not save new parent id to user ',
  createdStudent: 'could not create new student ',
  savedStudentToUser: 'could not save new student id to user ',
  savedEntranceExamSubscription:
    'could not create new entrance exam subscription ',
  dupPNQuery: 'query for duplicate phone number failed ',
  dupEmailQuery: 'query for duplicate email failed ',
  tokenCreate: 'could not create token ',
  userTokenUpdate: 'could not update user token ',
  checkingEmail: 'User(user email) does not exist ',
  checkingPassword: 'Error querying for matching passwords ',
  emailNotFound: 'user with specified email not found ',
  invalidPassword: 'your password is incorrect',
  loginFailed: 'login failed ',
  updateFailed: 'login failed ',
  invalidNotificationInformation: 'no email or phone number recieved ',
  invalidToken: 'Invalid Token ',
  noTokenIdMatch: 'could not match user to decoded id ',
  noAuthTokenPassed: 'no authorization token passed ',
  noCookieTokenPassed: 'no token passed via cookies ',
  invalidEmail: 'no user with given email ',
  savePin: 'could not save user reset pin ',
  userNotFoundById: 'Could not find matching user of given id ',
  queryById: 'Error querying user via id  ',
  sameNewAndPrevPassword: 'New Password is the same as old password ',
  savingNewPword: 'Error updating user password ',
  findingUserWithId: 'Could not find user with given id ',
  checkingParent: 'Error querying for finding parent ',
  updatingParent: 'Error querying for updating parent ',
  checkingStudent: 'Error querying for student ',
  updatingStudent: 'Error querying for updating student ',
  parentNotFound: 'could not find parent with id provided ',
  logoutFailed: 'could not logout ',
  checkingSession: 'could not found session ',
};

export const contentMessages = {
  lessonsFetchSuccess: 'Lessons fetch successfully',
  chaptersFetchSuccess: 'Chapters fetch successfully',
  subjectFetchSuccess: 'Subjects fetch successfully',
  testFetchSuccess: 'Test fetch successfully',
  reportCardFetchSuccess: 'Report card fetch successfully',
  leaderboardFetchSuccess: 'Leaderboard fetch successfully',
  updatedLeaderboardSuccess: 'Leaderboard updated successfully',
  mockTestFetchSuccess: 'Mock test fetch successfully',
  addReviewSuccess: 'Review added successfully',
  reviewsFetchSuccess: 'Reviews fetch successfully',
  updatedMockTestSuccess: 'Mock test updated successfully',
};
export const contentErrors = {
  failedToFetchChapter: 'Failed to fetch chapter with this id ',
  failedToFetchsubject: 'Failed to fetch subject',
  failedToFetchLesson: 'Failed to fetch lesson',
  failedToFetchTest: 'Failed to fetch test',
  failedToStudent: 'Failed to fetch student',
  failedToFetchReportCard: 'Failed to fetch report card',
  updatingLeaderboardFail: 'Failed to update leaderboard sessions',
  checkingLeaderboard: 'error while fetching leaderboard.',
  leaderboardNotFound: 'could not find leaderboard with id provided',
  updatingLeaderboard: 'Error querying for updating leaderboard',
  failedToFetchLeaderboard: 'Failed to fetch leaderboard',
  failedToFetchMockTest: 'Failed to fetch mock test',
  failedToFetchStudents: 'error while fetching students. ',
  failToaddReview: 'Failed to add review',
  checkingLesson: 'error while fetching lesson ',
  saveReview: 'could not save new review ',
  failedToFetchReview: 'Failed to fetch review',
  updatingMockTestFail: 'Failed to update mock test',
  checkingMockTest: 'error while fetching mock test.',
  mockTestNotFound: 'could not find mock test with id provided',
};

export const profileMessages = {
  updatedSuccess: 'Profile updated successfully',
  updatedFail: 'Profile updated successfully',
  userNotFound: 'No user found',
};

export const adminMessages = {
  bulk: 'bulk registration successful',
  fetchSessionSuccess: 'User sessions fetched successfully',
  endSessionSuccess: 'User sessions ended successfully',
  recoverSessionSuccess: 'User sessions recovered successfully',
  userSuspendedSuccess: 'User suspended successfully',
  studentFetchSuccess: 'Students Fetched successfully',
  addCustomerCareSuccess: 'Customer Care Added successfully',
  customerFetchSuccess: 'Customers Fetched successfully ',
  updatedCustomerSuccess: 'Customer profile updated successfully',
  addAdminCreateSuccess: 'Admin created successfully',
  adminFetchSuccess: 'Admin fetched successfully',
  userFetchSuccess: 'Users Fetched successfully',
  lessonCreateSuccess: 'Lesson created successfully',
  failToCreateLesson: 'Error while creating lesson',
  chapterCreateSuccess: 'Chapter created successfully',
  failToCreateChapter: 'Error while creating chapter',
  updatedLessonSuccess: 'Lesson updated successfully',
  updatedSubjectSuccess: 'Subject updated successfully',
  testCreateSuccess: 'Test created successfully',
  updatedTestSuccess: 'Test updated successfully',
  mockTestCreateSuccess: 'Mock test created successfully',
  updatedMockTestSuccess: 'Mock test updated successfully',
  badgeCreateSuccess: 'Badge created successfully',
  updatedBadgeSuccess: 'Badge updated successfully',
  reportCardCreateSuccess: 'Report card created successfully',
  updatedReportCardSuccess: 'Report card updated successfully',
  updatedChapterSuccess: 'Chapter updated successfully',
  updatedSettingSuccess: 'Setting updated successfully',
  userSettingFetchSuccess: 'User setting Fetched successfully',
  classCreateSuccess: 'Class created successfully',
  failToCreateClass: 'Error while creating class',
  failToBookedClass: 'Error while adding booked class',
  bookedClassSuccess: 'Booked class created successfully',
  bookAttendeesSuccess: 'Attendees booked successfully',
  failToCreateAttendees: 'Error while creating attendees',
  updatedEmailSuccess: 'Email updated successfully',
  emailTemplateFetchSuccess: 'Email template Fetched successfully',
  bannerFetched: 'Banners fetched successfully.',
  bannerAdded: 'Banners Added successfully.',
  bannerUpdated: 'Banners updated successfully.',

};

export const adminErrors = {
  updateFailed: 'login failed ',
  fetchSessionFailed: 'Failed to fetch user sessions ',
  fetchUserFailed: 'Failed to fetch user ',
  endSessionFailed: 'Failed to end user sessions ',
  updateSessionFailed: 'Failed to update user sessions ',
  recoverSessionFailed: 'Failed to recover user sessions ',
  userNotFoundWithId: 'No user found with this id. ',
  checkingUser: 'error while fetching user. ',
  checkingSession: 'error while fetching session. ',
  failedToFetchStudents: 'error while fetching students. ',
  failedToSuspendUser: 'error while suspending user. ',
  sessionNotFoundWithId: 'no session found for this parent. ',
  noParentFound: 'parent not found with this user id. ',
  noUserFound: 'user not found with this id. ',
  tokenCreate: 'could not create token ',
  tokenVerify: 'could not verify session token ',
  customerCareCreateFailed: 'error while creating customer care. ',
  dupPNQuery: 'query for duplicate phone number failed ',
  dupEmailQuery: 'query for duplicate email failed ',
  saveUser: 'could not save new user ',
  updatingCustomer: 'Error querying for updating customer ',
  checkingCustomer: 'Error querying for finding customer ',
  failedToFetchCustomers: 'error while fetching customers. ',
  customerNotFound: 'could not find customer with id provided ',
  failToCreateAdmin: 'Error while creating admin',
  adminCreateFailed: 'Failed to create new admin ',
  failedToFetchAdmin: 'Failed to fetch admin ',
  checkingAdmin: 'Error querying for finding admin ',
  adminNotFound: 'could not find admin with id provided',
  updatingAdmin: 'Error querying for updating admin ',
  failedToFetchUsers: 'error while fetching users. ',
  checkingChapter: 'error while fetching chapter. ',
  failedToFetchSubjectById: 'Failed to fetch subject with this id ',
  saveLesson: 'could not save new lesson ',
  checkingSubject: 'error while fetching subject. ',
  saveChapter: 'could not save new chapter ',
  updatingLessonFail: 'Failed to update lesson sessions',
  checkingLesson: 'error while fetching lesson ',
  lessonNotFound: 'could not find lesson with id provided',
  updatingLesson: 'Error querying for updating lesson ',
  updatingSubjectFail: 'Failed to update subject',
  subjectNotFound: 'could not find subject with id provided',
  updatingSubject: 'Error querying for updating subject',
  failToCreateTest: 'Error while creating test',
  updatingTestFail: 'Failed to update test sessions',
  failedToFetchLessons: 'Failed to fetch lessons with this id',
  saveTest: 'could not save new test ',
  checkingTest: 'error while fetching test.',
  testNotFound: 'could not find test with id provided',
  updatingTest: 'Error querying for updating test',
  failToCreateMockTest: 'Error while creating mock test',
  updatingMockTestFail: 'Failed to update mock test sessions',
  saveMockTest: 'could not save new mock test ',
  mockTestNotFound: 'could not find mock test with id provided',
  checkingMockTest: 'error while fetching mock test.',
  updatingMockTest: 'Error querying for updating badge',
  failToCreateBadge: 'Error while creating badge',
  saveBadge: 'could not save new badge ',
  updatingBadgeFail: 'Failed to update badge sessions',
  checkingBadge: 'error while fetching badge.',
  badgeNotFound: 'could not find badge with id provided',
  updatingBadge: 'Error querying for updating badge',
  failToCreateReportCard: 'Error while creating report card',
  updatingReportCardFail: 'Failed to update report card sessions',
  failedToFetchReportCard: 'error while fetching report card. ',
  failedToStudent: 'Failed to fetch student',
  failedToFetchTest: 'Failed to fetch test',
  failedToFetchLesson: 'Failed to fetch lesson',
  saveReportCard: 'could not save new report card',
  checkingReportCard: 'error while fetching report card.',
  reportCardNotFound: 'could not find report card with id provided',
  updatingReportCard: 'Error querying for updating report card',
  checkingLearningPackage: 'error while fetching learning package ',
  failedToFetchLearningPackage: 'Failed to fetch learning package with this id',
  saveSubject: 'could not save new subject ',
  subjectCreateSuccess: 'Subject created successfully',
  failToCreateSubject: 'Error while creating subject',
  failToGetExcel: 'Only .xlsx file allowed',
  updatingChapterFail: 'Failed to update chapter sessions',
  chapterNotFound: 'could not find chapter with id provided',
  updatingChapter: 'Error querying for updating chapter ',
  updatingSettingFail: 'Failed to update settings',
  checkingSetting: 'error while fetching setting. ',
  settingNotFound: 'could not find setting with id provided',
  updatingSetting: 'Error querying for updating setting ',
  failedToFetchSetting: 'error while fetching setting. ',
  saveClass: 'could not save new class ',
  checkingStudent: 'Error querying for student ',
  studentsNotFound: 'could not find student with id = ',
  checkingClass: 'error while fetching class. ',
  classNotFound: 'could not find class with id provided',
  emailCreateSuccess: 'Email created successfully',
  failToCreateEmail: 'Error while creating email',
  saveEmail: 'could not save new email ',
  updatingEmailFail: 'Failed to update email sessions',
  checkingTemplate: 'error while fetching email template. ',
  templateNotFound: 'could not find email template with id provided',
  updatingTemplate: 'Error querying for updating email template',
  failedToFetchEmailTemplate: 'error while fetching email template. ',
  failedToFetchBanner: 'Failed to fetch banners.',
  failedToUpdateBanner: 'Failed to update banners.',
  failToAddBanner: 'Failed to add banners.',
};
export const liveClassMessages = {
  upcomingClassesFetchSuccess: 'Upcoming classes fetch successfully',
};
export const liveClassErrors = {
  failedToFetchUpcomingClasses: 'Failed to fetch upcoming classes',
};
export const userMessages = {
  badgeFetchSuccess: 'Badge fetch successfully',
  createdStudent: 'Students Created Successfully',
  studentsFetchSuccess: 'Students Fetched successfully',
  countries: 'all countries retrieved successfully',
  endpoints: 'authentication endpoints retrieved successfully',
  userCreated: 'user created successfully',
  teacherCreated: 'Teacher profile created successfully',
  profileUpdateSuccessful: 'profile updated successfully',
  createdResult: 'Result Created Successfully',
};
export const userErrors = {
  failedToFetchBadge: '',
  failToGetResult:"Could not create result",
  updateFailed: 'login failed ',
  createdStudent: 'could not create new student ',
  createdResult: 'could not create new result ',
  updatingStudent: 'Error querying for updating student ',
  getStudentsFailed: 'failed to fetch students',
  noCookieTokenPassed: 'no token passed via cookies ',
  noAuthTokenPassed: 'no authorization token passed ',
  invalidToken: 'Invalid Token ',
  noTokenIdMatch: 'could not match user to decoded id ',
  sessionExpired:
    'your session has expired. Login again to get a new session and token',
  createdParent: 'could not create new parent ',
  checkingStudent: 'Error querying for student ',
  parentNotFound: 'could not find parent with id provided ',
  queryingParent: 'could not find parent with user id provided',
  studentsNotFound: 'could not find students',
  userNotFoundById: 'Could not find matching user of given id ',
  checkingParent: 'Error querying for finding parent ',
  updatingParent: 'Error querying for updating parent ',
};

export const storeErrors = {
  failedToAddProduct: 'Failed to add product',
  productAddedSuccess: 'product added successfully',
  failedToFetchProduct: 'Failed to fetch product',
  productFetchedSuccess: 'product fetched successfully',
  failedToUpdateProduct: 'Failed to update product',
  productUpdatedSuccess: 'product updated successfully',
  productNotFound: 'product not found',
  failedToFindProduct: 'error while finding product',
  failedToAddProductInCart: 'failed to add product in cart',
  productAddedToCart: 'Product added to cart',
  errorWhileFindingCart: 'Error while finding cart.',
  cartNotFound: 'Cart not found.',
  cartIsEmpty: 'Cart is empty.',
  cartUpdated: 'Cart updated.',
  cartDeleted: 'Cart deleted.',
  failedToUpdateCart: 'Failed to update cart.',
  failedToDeleteCart: 'Failed to delete cart.',
  cartFetched: 'Cart fetched successfully.',
  failedToFetchCart: 'Failed to fetch cart.',
  orderCreated: 'Order created successfully.',
  failedToCreateOrder: 'Failed to create order.',
};

export const ebookErrors = {
  failedToAddEbook: 'Failed to add ebook',
  ebookAddedSuccess: 'ebook added successfully',
  failedToFetchEbook: 'Failed to fetch ebook',
  ebookFetchedSuccess: 'ebook fetched successfully',
  failedToUpdateEbook: 'Failed to update ebook',
  ebookUpdatedSuccess: 'ebook updated successfully',
  ebookNotFound: 'ebook not found',
  failedToFindEbook: 'error while finding ebook',
  failedToAddEbookInCart: 'failed to add ebook in cart',
  ebookAddedToCart: 'Ebook added to cart',
  cartFetched: 'Cart fetched successfully.',
  failedToFetchCart: 'Failed to fetch cart.',
  errorWhileFindingCart: 'Error while finding cart.',
  cartNotFound: 'Cart not found.',
  cartIsEmpty: 'Cart is empty.',
  cartDeleted: 'Cart deleted.',
  failedToUpdateCart: 'Failed to update cart.',
  failedToDeleteCart: 'Failed to delete cart.',
  orderCreated: 'Order created successfully.',
  failedToCreateOrder: 'Failed to create order.',
};
