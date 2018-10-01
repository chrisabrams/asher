const keyFilename = require('../lib/keyfile-path')

const Storage = require('@google-cloud/storage')
const storage = Storage({
  keyFilename,
  projectId: process.env.GCLOUD_PROJECT
})

const bucket = storage.bucket(process.env.GCLOUD_BUCKET)

function downloadFile(sourcePath, destPath) {

  let source = sourcePath

  /*
  NOTE:
  If the sourcePath is the full public url, just get the filename in the bucket.
  */
  if(sourcePath.indexOf('http') > -1) {
    const split = sourcePath.split('/')
    source = split[split.length - 1]
  }

  return bucket.file(source).download({destination: destPath})

}

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${filename}`
}

function uploadFileStream(file, destPath) {

  return new Promise(async (resolve, reject) => {

    const upload = bucket.file(destPath)

    const stream = upload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      },
      resumable: false
    })
  
    stream.once('error', (err) => {
      //file.cloudStorageError = err
      console.error('Could not upload to Google Cloud')
      console.error(err)
      reject(err)
    })
  
    stream.once('finish', () => {
  
      upload.makePublic().then( () => {
        //file.cloudStoragePublicUrl = getPublicUrl(destPath)
  
        resolve()
      })
    })
  
    stream.end(file.buffer)

  })

}

module.exports.bucket = bucket
module.exports.downloadFile = downloadFile
module.exports.getPublicUrl = getPublicUrl
module.exports.storage = storage
module.exports.uploadFileStream = uploadFileStream
