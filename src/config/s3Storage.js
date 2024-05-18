const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETACESSKEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

module.exports = {
  uploadFile: async (filePath, bucketName, keyName) => {
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', function(err) {
      console.error('File Error', err);
    });

    const uploadParams = {
      Bucket: bucketName,
      Key: keyName,
      Body: fileStream,
      ContentDisposition: 'inline'
    };

    return await s3.upload(uploadParams).promise();
  },

  downloadFile: async (bucketName, keyName) => {
    const downloadParams = {
      Bucket: bucketName,
      Key: keyName
    };

    return await s3.getObject(downloadParams).promise();
  }
};
