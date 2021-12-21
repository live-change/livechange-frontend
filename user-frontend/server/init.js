const app = require('@live-change/framework').app()

module.exports = async function(services) {

  const user = '[testUser]'
  const email = 'tester@test.com'
  await services.user.models.User.create({ id: user, roles: [] })
  await services.email.models.Email.create({ id: email, email, user })

}
