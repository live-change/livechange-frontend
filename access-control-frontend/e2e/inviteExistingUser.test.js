const happyPath = false

Feature('access control invite')

Scenario('invite user that already exists', async ({ I }) => {

  const adminUser = await I.haveUser()
  const anotherUser = await I.haveUser()
  await I.haveUserWithAccess(adminUser, 'example_Example', 'one', ['administrator'])

  await I.amOnPage('/')
  await I.amLoggedIn(adminUser)

  I.see('Access Granted')
  I.click('Share')
  I.see('Access Control')
  I.click('Invite with email')
  I.see('Invite user with email')
  I.fillField('input[type="text"]', anotherUser.email)
  I.click('Invite')

})
