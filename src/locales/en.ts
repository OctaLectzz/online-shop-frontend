const en = {
  public: {
    loadingText: 'Loading...',
    cancelText: 'Cancel'
  },
  auth: {
    name: 'Name',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phoneNumber: 'Phone Number',
    loginBtn: 'Login',
    registerBtn: 'Register',
    logoutBtn: 'Logout',
    logoutTitle: 'Are you sure you want to log out?',
    logoutSubtitle: 'You will be logged out of your account and need to login again to access the dashboard.',
    response: {
      successRegisterMsg: 'Register Successfully',
      failedRegisterMsg: 'Register Failed',
      successLoginMsg: 'Login Successfully',
      failedLoginMsg: 'Login Failed',
      successLogoutMsg: 'Logout Successfully',
      failedLogoutMsg: 'Logout Failed'
    },
    validate: {
      nameRequired: 'Name must be filled in',
      nameMaxLength: 'Maximum name is 50 characters',
      usernameRequired: 'Username must be filled in',
      usernameMaxLength: 'Maximum username is 20 characters',
      emailFormat: 'Invalid email format',
      emailAlready: 'Email already exists',
      passwordRequired: 'Password must be filled in',
      passwordMinLength: 'Password must be at least 8 characters',
      confirmPasswordNotMatch: 'Passwords do not match',
      phoneNumberMaxLength: 'Maximum phone number is 15 characters'
    }
  }
}

export default en
