const App = require('@live-change/framework')
const app = App.app()

module.exports = async function(services) {

  const { PasswordAuthentication } = services.passwordAuthentication.models
  const { PublicAccess, Access, AccessRequest } = services.accessControl.models

  const user = '[testUser]'
  const email = 'tester@test.com'
  const password = 'Testy123'
  const session = 'xyLRAj38fIMjTImlkgzvkdVefXTZk/1j'
  //console.log("MDL", services.passwordAuthentication.models.PasswordAuthentication)

  const user2 = '[testUser2]'
  const email2 = 'tester2@test.com'
  const password2 = 'Testy123'

  const passwordHash = PasswordAuthentication.definition.properties.passwordHash.preFilter(password)
  await services.user.models.User.create({ id: user, roles: [] })
  await PasswordAuthentication.create({ id: user, user, passwordHash })
  await services.email.models.Email.create({ id: email, email, user })
  await services.userIdentification.models.Identification.create({
    id: App.encodeIdentifier(['user_User', user]), ownerType: 'user_User', owner: user,
    name: 'Test User 1'
  })
  //await services.user.models.AuthenticatedUser.create({ id: session, session, user })

  await services.user.models.User.create({ id: user2, roles: [] })
  await PasswordAuthentication.create({ id: user2, user: user2, passwordHash })
  await services.email.models.Email.create({ id: email2, email: email2, user: user2 })
  await services.userIdentification.models.Identification.create({
    id: App.encodeIdentifier(['user_User', user]), ownerType: 'user_User', owner: user,
    name: 'Test User 2 with very long name!'
  })

/*  await PublicAccess.create({
    id: App.encodeIdentifier(['example_Example', 'one']),
    objectType: 'example_Example', object: 'one',
    userRoles: ['reader'],
    sessionRoles: []
  })*/

  await Access.create({
    id: app.generateUid(),
    ownerType: 'user_User', owner: user,
    objectType: 'example_Example', object: 'one',
    roles: ['administrator']
  })

  await AccessRequest.create({
    id: app.generateUid(),
    ownerType: 'user_User', owner: user2,
    objectType: 'example_Example', object: 'one',
    roles: ['writer']
  })

}
