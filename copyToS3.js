const fs = require('fs');
const async = require('async');
const aws = require('aws-sdk');
const s3 = new aws.S3();

function uploadFile(file, callback) {
  fs.readFile('./build/' + file, function(err,data) {
    if (err) {
      console.log('Error reading file');
      console.log(err);
      callback(err);
    } else {
      const base64data = new Buffer(data, 'binary');
      s3.putObject({
        'Bucket': 'ez-react-boilerplate',
        'Key': file,
        'Body': base64data
      }, function(err, data) {
        if (err) {
          console.log('Oh, Snap');
          console.log(err);
          callback(err);
        } else {
          console.log('Uploaded ' + file);
          callback();
        }
      })
    }
  })
}
fs.readdir('./build', (err, files) => {
  async.forEach(files, function (file, cb) {
    console.log('Working on file: ' + file);
    uploadFile(file, cb);
  }, function (err) {
    console.log('DONE!');
  })
});
