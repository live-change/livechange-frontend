const {createUser} = require("@live-change/user-frontend/server/init-functions.js");
const App = require('@live-change/framework')
const app = App.app()

module.exports = async function(services) {
  const user1 = await createUser(services,
    'Test User 1', 'test1@test.com', 'Testy123', 'u1', ['writer'])

  const pageId = 'one'
  const documentId = App.encodeIdentifier(['content_Page', 'one'])
  const snapshotId = App.encodeIdentifier([documentId, (0).toFixed().padStart(10, '0')])

  const documentContent = {
    "type": "doc",
    "content": [].concat(new Array(2).fill(
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "test"
          },
          {
            "type": "text",
            "marks": [
              {
                "type": "bold"
              }
            ],
            "text": "est"
          }
        ]
      }
    ))
  }
  const documentTime = new Date()

  await services.content.models.Page.create({
    id: pageId
  })

  await services.prosemirror.models.Document.create({
    id: documentId,
    ownerType: 'content_Page',
    owner: 'one',
    type: 'content',
    purpose: 'page',
    version: 1,
    content: documentContent,
    created: documentTime,
    lastModified: documentTime
  })
  await services.prosemirror.models.Snapshot.create({
    id: snapshotId,
    document: documentId,
    version: 1,
    content: documentContent,
    timestamp: documentTime,
  })

  await services.content.models.Content.create({
    id: App.encodeIdentifier(['content_Page', 'one']),
    objectType: 'content_Page',
    object: 'one',
    snapshot: snapshotId
  })

  await services.accessControl.models.PublicAccess.create({
    id: App.encodeIdentifier(['content_Page', 'one']),
    objectType: 'content_Page',
    object: 'one',
    sessionRoles: ['reader']  .concat(['writer'])
  })
  await services.accessControl.models.Access.create({
    id: App.encodeIdentifier(['user_User', user1.id, 'content_Page', 'one']),
    sessionOrUserType: 'user_User', sessionOrUser: user1.id,
    objectType: 'content_Page', object: 'one',
    roles: ['writer']
  })

  await services.url.models.Canonical.create({
    id: App.encodeIdentifier(['content_Page', 'one']),
    domain: '',
    path: 'test',
    targetType: 'content_Page',
    target: 'one'
  })
  await services.url.models.Redirect.create({
    id: app.generateUid(),
    domain: 'localhost:8001',
    path: 'test-redirect',
    targetType: 'content_Page',
    target: 'one'
  })

}
