const {createUser} = require("@live-change/user-frontend/server/init-functions.js");
const App = require('@live-change/framework')
const app = App.app()

module.exports = async function(services) {

  const testUser = await createUser(services,
    'Test User', 'test@test.com', 'Testy123', 'u1', ['writer'])

}
