const randomProfile = require('random-profile-generator')

const user = randomProfile.profile()
user.email = user.firstName.toLowerCase() + '@test.com' // test domain - emails not sent

const happyPath = false

Feature('write')

Scenario('post message', async ({ I }) => {

  I.amOnPage('/sign-up')
  I.fillField('input#email', user.email)
  I.click('button[type=submit]')

  I.seeInCurrentUrl('/sent/')
  const url = await I.grabCurrentUrl()
  const authentication = url.split('/').pop()

  const authenticationData = await I.grabObject('messageAuthentication', 'Authentication', authentication)
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

  if(!happyPath) {
    I.amOnPage('/link/' + linkData.secretCode)
    I.see('Link used')
  }

})
