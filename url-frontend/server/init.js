const {createUser} = require("@live-change/user-frontend/server/init-functions.js");
const app = require('@live-change/framework').app()

module.exports = async function(services) {
  const user1 = await createUser(services,
    'Test User 1', 'test1@test.com', 'Testy123', 'u1')

  await services.url.models.Canonical.create({
    id: app.generateUid(),
    domain: 'localhost',
    path: '/test2',
    targetType: 'example_Example',
    target: 'one'
  })
  await services.url.models.Redirect.create({
    id: app.generateUid(),
    domain: 'localhost',
    path: '/test',
    targetType: 'example_Example',
    target: 'one'
  })
}
