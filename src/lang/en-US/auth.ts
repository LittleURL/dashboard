export default {
  users: 'Users',

  // login
  login: 'Login',
  logout: 'Logout',
  register: 'Register',
  nickname: 'Display Name',
  editProfile: 'Edit Profile',
  changePassword: 'Change Password',
  passwordChanged: 'Password updated',
  forgotPassword: 'Forgot Password',
  resendCode: 'Resend code',
  codeSent: 'Confirmation code has been sent to your email address',

  // credentials
  code: 'Confirmation Code',
  email: 'Email Address',
  emailConfirm: 'Confirm Email',
  password: 'Password',
  passwordConfirm: 'Confirm Password',
  oldPassword: 'Old Password',

  // policies
  passwordPolicy: {
    title: 'Password Policy',
    minLength: 'Password must contain at least {len} characters',
    lowercase: 'Password must contain a lower case letter',
    uppercase: 'Password must contain an upper case letter',
    numbers: 'Password must contain a number',
    symbols: 'Password must contain a special character or a space',
    whitespace: 'Password must not contain a leading or trailing space',
  },

  // challenges
  emailNotConfirmed: 'Email address is pending confirmation',
  invalidLogin: 'Email address and/or password is incorrect',
  challenge: {
    newPassword: 'Password change required',
    confirmEmail: 'Confirm email address',
    softwareMfa: 'Enter code from your MFA app',
  },

  // mfa
  mfa: 'Multi-Factor Authentication',
  mfaMethod: 'Current MFA method: {0}',
  enableMfa: 'Enable MFA Device',
  disableMfa: 'Disable MFA Device',
  disableMfaConfirm: 'Are you sure you want to disable your MFA?',
  mfaScanCode: 'Scan code above using a TOTP app such as',

  // roles
  role: 'Role',
  editRole: 'Edit Role',
  deleteRole: 'Delete User Access',
  invite: 'Invite User',
  inviteSuccess: 'User invitation sent successfully',
  acceptInvite: 'Accept invite',
  inviteAccepted: 'Invite accepted successfully',
}
