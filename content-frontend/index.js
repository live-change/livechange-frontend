import Content from './front/src/components/Content.vue'
import ContentEditor from './front/src/components/ContentEditor.vue'
import Metadata from './front/src/components/Metadata.vue'
import MetadataEditor from './front/src/components/MetadataEditor.vue'
import NotFoundAdminButtons from './front/src/components/NotFoundAdminButtons.vue'
import Page from './front/src/components/Page.vue'
import PageEditor from './front/src/components/PageEditor.vue'
import PagePreview from './front/src/components/PagePreview.vue'
import PageAdminButtons from './front/src/components/PageAdminButtons.vue'

export {
  Content, ContentEditor, Metadata, MetadataEditor, NotFoundAdminButtons, Page, PageEditor, PagePreview,
  PageAdminButtons
}

import { catchAllPagesRoute, contentEditRoutes, pagesSitemap } from "./front/src/components/routes"

export { catchAllPagesRoute, contentEditRoutes, pagesSitemap }
