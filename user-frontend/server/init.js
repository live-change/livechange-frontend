const app = require('@live-change/framework').app()

module.exports = async function(services) {

  const user = '[testUser]'
  const email = 'tester@test.com'
  const email2 = 'tester2@test.com'
  const password = 'Testy123'
  const session = 'xyLRAj38fIMjTImlkgzvkdVefXTZk/1j'
  //console.log("MDL", services.passwordAuthentication.models.PasswordAuthentication)
  const passwordHash = services.passwordAuthentication.models.PasswordAuthentication
      .definition.properties.passwordHash.preFilter(password)
  await services.user.models.User.create({ id: user, roles: [] })
  await services.passwordAuthentication.models.PasswordAuthentication.create({ id: user, user, passwordHash })
  await services.email.models.Email.create({ id: email, email, user })
  await services.email.models.Email.create({ id: email2, email: email2, user })
  //await services.user.models.AuthenticatedUser.create({ id: session, session, user })

}
