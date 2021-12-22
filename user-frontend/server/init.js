const app = require('@live-change/framework').app()

module.exports = async function(services) {

  const user = '[testUser]'
  const email = 'tester@test.com'
  const email2 = 'tester2@test.com'
  await services.user.models.User.create({ id: user, roles: [] })
  await services.email.models.Email.create({ id: email, email, user })
  await services.email.models.Email.create({ id: email2, email: email2, user })

}
