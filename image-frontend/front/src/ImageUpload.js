import { ref, onUnmounted, watch } from 'vue'
import { api as useApi } from '@live-change/vue3-ssr'
import { Upload } from '@live-change/upload-frontend'
import { blobToDataUrl } from "./imageUtils.js"
import preProcessImageFile from "./preprocessImageFile.js";

class ImageUpload {
  constructor(purpose, uploadable, options = {}) {
    const blob = uploadable.file
    const {
      fileName = blob?.name || 'unknown',
      api = useApi(options.appContext),
      uploadOptions = {}
    } = options
    this.options = options
    this.purpose = purpose
    this.fileName = fileName
    this.uploadOptions = { appContext: options.appContext, api, ...uploadOptions }
    this.api = api
    this.id = options.id
    this.blob = null
    this.uploadable = uploadable
    this.size = null
    const clientConfig = api.getServiceDefinition('image')?.clientConfig
    this.config = clientConfig.upload

    this.ownerType = options.ownerType
    this.owner = options.owner
    if(!this.ownerType || !this.owner) {
      const client = api.client.value
      if(client.user) {
        this.ownerType = 'user_User'
        this.owner = client.user
      } else {
        this.ownerType = 'session_Session'
        this.owner = client.session
      }
    }

    this.url = ref()

    this.error = ref()
    this.state = ref('starting')

    this.prepared = false

    this.preparePromise = null
    this.uploadPromise = null
  }

  prepare() {
    if(!this.preparePromise) this.preparePromise = (async () => {
      if(this.options.unpreparedPreview) {
        if(this.uploadable.canvas) {
          this.url.value = this.uploadable.canvas.toDataURL(this.options.fileType || 'image/png')
        } else if(this.uploadable.file) {
          this.url.value = await blobToDataUrl(this.uploadable.file)
        }
      }

      const processed = await preProcessImageFile(this.uploadable, { ...this.config, ...this.options })
      this.blob = processed.blob
      this.size = processed.size

      if(this.options.preparedPreview) {
        if(processed.canvas) {
          this.url.value = processed.canvas.toDataURL(this.options.fileType || 'image/png')
        } else {
          this.url.value = await blobToDataUrl(this.blob)
        }
      }

      if(!this.id) {
        this.id = this.api.uid()
        if(this.options.createEmpty) {
          await this.api.command(["image", "createEmptyImage"], {
            image: this.id,
            purpose: this.purpose,
            name: this.uploadable.name || this.uploadable.file.name || this.options.name || 'unknown',
            ownerType: this.ownerType,
            owner: this.owner,
          }).catch(error => {
            this.error = error
          })
        }
      }
      this.prepared = true
    })()
    return this.preparePromise
  }

  async upload() {
    if(!this.uploadPromise) this.uploadPromise = (async () => {
      await this.prepare()

      this.state.value = 'uploading'

      this.fileUpload = new Upload(this.purpose, this.blob, { fileName: this.fileName, ...this.uploadOptions })
      await this.fileUpload.promise

      try {
        if (this.options.crop) {
          await this.api.command(["image", "cropImage"], {
            image: this.id,
            crop: this.options.crop,
            upload: this.fileUpload.id
          })
        } else {
          if (this.options.createEmpty) {
            await this.api.command(["image", "uploadImage"], {
              image: this.id,
              original: {
                width: this.size.width,
                height: this.size.height,
                upload: this.fileUpload.id
              }
            })
          } else {
            await this.api.command(["image", "createImage"], {
              image: this.id,
              name: this.uploadable.name || this.uploadable.file.name || this.options.name || 'unknown',
              original: {
                width: this.size.width,
                height: this.size.height,
                upload: this.fileUpload.id
              },
              purpose: this.purpose,
              ownerType: this.ownerType,
              owner: this.owner,
            })
          }
        }
        this.uploadedUrl.value = `/pictures/${this.id}/original`
        this.blobUrl.value = undefined
        this.state.value = 'done'
      } catch(error) {
        this.error.value = error
      }

      this.state.value = 'done'

      /// TODO: set this.url.value to server-side address
    })()
    return this.uploadPromise
  }
}

export default ImageUpload
