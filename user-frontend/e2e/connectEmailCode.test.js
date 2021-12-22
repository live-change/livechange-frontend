const app = require('@live-change/framework').app()
const randomProfile = require('random-profile-generator')

const email = randomProfile.profile().firstName.toLowerCase() + '@test.com' // test domain - emails not sent
const email2 = randomProfile.profile().firstName.toLowerCase() + '2@test.com' // test domain - emails not sent

const happyPath = false

Feature('write')

Scenario('connect email with code', async ({ I }) => {

  const user = app.generateUid()

  const User = await I.haveModel('user', 'User')
  const Email = await I.haveModel('email', 'Email')
  const AuthenticatedUser = await I.haveModel('user', 'AuthenticatedUser')

  await User.create({ id: user, roles: [] })
  await Email.create({ id: email, email, user })
  I.amOnPage('/')
  const session = await I.executeScript(() => api.client.value.session)
  await AuthenticatedUser.create({ id: session, user, session })

  I.amOnPage('/connected')
  I.see(email)
  I.dontSee(email2)

  I.click('button#connect')

  I.seeInCurrentUrl('/connect')

  if(!happyPath) {
    I.fillField('input#email', email)
    I.click('button[type=submit]')
    I.see('')
  }

  I.fillField('input#email', email2)
  I.click('button[type=submit]')

  I.seeInCurrentUrl('/sent/')

  const url = await I.grabCurrentUrl()
  const authentication = url.split('/').pop()

  const authenticationData = await I.grabObject('messageAuthentication', 'Authentication', authentication)
  console.log("AUTHENTICATION DATA", authenticationData)
  I.assert(!!authenticationData, true, 'authentication created')
  I.assert(authenticationData?.messageData?.user, user, 'authentication contains user')

  const Code = await I.haveModel('secretCode', 'Code')
  let codeData = await Code.indexObjectGet('byAuthentication', authentication)
  console.log("CODE DATA", codeData)
  I.assert(!!codeData, true, 'code created')

  if(!happyPath) {
    const wrongCode = codeData.secretCode == '123456' ? '654321' : '123456'
    I.fillField('input#code', wrongCode)
    I.fillField('input#code', wrongCode) /// twice because it can fail once with this type of field
    I.click('button[type=submit]')
    I.seeElement('#code-help.p-error')
  }

  if(!happyPath) {
    await I.wait(0.2)
    await Code.update(codeData.id, { expire: new Date() }) // expire now
    I.fillField('input#code', codeData.secretCode)
    I.fillField('input#code', codeData.secretCode) /// twice because it can fail once with this type of field
    I.click('button[type=submit]')
    I.seeElement('#code-help.p-error')

    I.click('Resend')
    I.seeInCurrentUrl('/sent/')

    await I.wait(0.2)
    const newCodeData = await Code.indexRangeGet('byAuthentication', authentication)
    newCodeData.sort((a,b) => new Date(b.expire).getTime() - new Date(a.expire).getTime())
    const oldCodeData = codeData
    codeData = newCodeData[0]
    I.assert(!!codeData, true, 'code exists')
    I.assert(oldCodeData.id != codeData.id, true, 'code is different from previous code')
  }

  I.fillField('input#code', codeData.secretCode)
  I.fillField('input#code', codeData.secretCode) /// twice because it can fail once with this type of field
  I.click('button[type=submit]')
  I.wait(0.1)
  I.seeInCurrentUrl('/connect-finished')

  if(!happyPath) {
    I.amOnPage(url)
    I.seeInCurrentUrl('/connect-finished')
  }

})
