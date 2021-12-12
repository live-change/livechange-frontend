module.exports = {
  services: [
    {
      name: 'session',
      path: '@live-change/session-service'
    },
    {
      name: 'email',
      path: '@live-change/email-service'
    },
    {
      name: 'secret-link',
      path: '@live-change/secret-link-service'
    },
    //  { path: '@live-change/secret-code-service' },
    //  { path: '@live-change/smsapi-service' },
    {
      name: 'message-authentication',
      path: '@live-change/message-authentication-service',
      contactTypes: ['email']
    },
    //  { path: '@live-change/password-authentication-service' },
    //  { path: '@live-change/google-account-service' },
    //  {
    //    path: '@live-change/user-service',
    //    identifiers
    //  },
  ]
}
