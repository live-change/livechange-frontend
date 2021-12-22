const randomProfile = require('random-profile-generator')

const user = randomProfile.profile()
user.email = user.firstName.toLowerCase() + '@test.com' // test domain - emails not sent

const happyPath = false

Feature('write')

Scenario('sign up with email link', async ({ I }) => {

  I.amOnPage('/sign-up')
  I.fillField('input#email', user.email)
  I.click('button[type=submit]')

  I.seeInCurrentUrl('/sent/')
  const url = await I.grabCurrentUrl()
  const authentication = url.split('/').pop()

  const authenticationData = await I.grabObject('messageAuthentication', 'Authentication', authentication)
  console.log("AUTHENTICATION DATA", authenticationData)
  I.assert(!!authenticationData, true, 'authentication created')
  const Link = await I.haveModel('secretLink', 'Link')
  let linkData = await Link.indexObjectGet('byAuthentication', authentication)
  console.log("LINK DATA", linkData)
  I.assert(!!linkData, true, 'link created')

  if(!happyPath) {
    I.amOnPage('/link/[badSecret]')
    I.see('Unknown link')
  }

  if(!happyPath) {
    await I.wait(0.2)
    await Link.update(linkData.id, { expire: new Date() }) // expire now
    I.amOnPage('/link/' + linkData.secretCode)
    I.see('Link expired')

    I.click('Resend')
    I.seeInCurrentUrl('/sent/')

    await I.wait(0.2)
    const newLinksData = await Link.indexRangeGet('byAuthentication', authentication)
    newLinksData.sort((a,b) => new Date(b.expire).getTime() - new Date(a.expire).getTime())
    const oldLinkData = linkData
    linkData = newLinksData[0]
    I.assert(!!linkData, true, 'link exists')
    I.assert(oldLinkData.id != linkData.id, true, 'link is different from previous link')
  }

  I.amOnPage('/link/'+linkData.secretCode)
  I.seeInCurrentUrl('/sign-up-finished')
  const clientSession = await I.executeScript(() => api.client.value.session)
  const AuthenticatedUser = await I.haveModel('user', 'AuthenticatedUser')
  const authenticatedUserData = await AuthenticatedUser.get(clientSession)
  I.assert(!!authenticationData, true, 'user authenticated server-side')
  const clientUser = await I.executeScript(() => api.client.value.user)
  console.log("CLIENT USER", clientUser)
  console.log("SERVER AUTHENTICATION", authenticatedUserData)
  I.assert(clientUser, authenticatedUserData.user, 'user authenticated')

  if(!happyPath) {
    I.amOnPage('/link/' + linkData.secretCode)
    I.see('Link used')
  }

})
