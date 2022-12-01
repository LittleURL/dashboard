export default {
  login: 'Login',
  logout: 'Logout',
  register: 'Register',
  nickname: 'Username',
  email: 'Email Address',
  emailConfirm: 'Confirm Email',
  password: 'Password',
  passwordConfirm: 'Confirm Password',
  passwordPolicy: {
    title: 'Password Policy',
    minLength: 'Password must contain at least {len} characters',
    lowercase: 'Password must contain a lower case letter',
    uppercase: 'Password must contain an upper case letter',
    numbers: 'Password must contain a number',
    symbols: 'Password must contain a special character or a space',
    whitespace: 'Password must not contain a leading or trailing space'
  },
  emailNotConfirmed: 'Email address is pending confirmation',
  invalidLogin: 'Email address and/or password is incorrect',
  challenge: {
    newPassword: 'Password change required',
    confirmEmail: 'Confirm email address'
  }
}