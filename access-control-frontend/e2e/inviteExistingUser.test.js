const happyPath = false

Feature('access control invite')

Scenario('invite user that already exists', async ({ I }) => {

  const adminUser = await I.haveUser()
  const invitedUser = await I.haveUser()
  await I.haveUserWithAccess(adminUser, 'example_Example', 'one', ['administrator'])

  await I.amOnPage('/')
  await I.amLoggedIn(adminUser)

  I.assert('it will fail', false)

})
