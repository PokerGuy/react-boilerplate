const fs = require('fs');
const async = require('async');
const aws = require('aws-sdk');
const s3 = new aws.S3();

function uploadFile(file, callback) {
  fs.readFile('/tmp/clone/build/' + file, function (err, data) {
    if (err) {
      console.log('Error reading file');
      console.log(err);
      callback(err);
    } else {
      const base64data = new Buffer(data, 'binary');
      const params = {
        Bucket: 'ez-react-boilerplate',
        Key: file,
        Body: base64data
      };
      const split = file.split('.');
      const last = split[split.length - 1];
      if (last === '.htaccess') {
        params.ContentType = 'binary/octet-stream'
      } else if (last === 'js') {
        params.ContentType = 'application/javascript'
      } else if (last === 'jpg') {
        params.ContentType = 'image/jpeg'
      } else if (last === 'ico') {
        params.ContentType = 'image/x-icon'
      } else if (last === 'html') {
        params.ContentType = 'text/html'
      } else if (last === 'json') {
        params.ContentType = 'application/json'
      }
      s3.putObject(params, function (err, data) {
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
async.series([
    function (cb) {
      console.log('Cleaning s3 bucket...');
      const params = {
        Bucket: 'ez-react-boilerplate'
      };
      s3.listObjects(params, function (err, data) {
        if (err) {
          console.log('Error on the listObjects');
          console.log(err);
        }
        console.log(data);
        if ('Contents' in data) {
          async.forEach(data.Contents, function (file, callback) {
            console.log('Deleting ' + file.Key);
            const p = {
              Bucket: 'ez-react-boilerplate',
              Key: file.Key
            };
            s3.deleteObject(p, function (err, data) {
              if (err) {
                console.log('Error ' + err);
                callback(err);
              } else {
                callback();
              }
            })
          }, function (err) {
            console.log('Done deleting...');
            cb();
          });
        } else {
          console.log('Nothing to delete...');
          cb();
        }
      })
    },
    function (cb) {
      console.log('Uploading files to s3...');
      fs.readdir('/tmp/clone/build', (err, files) => {
        async.forEach(files, function (file, cb) {
          console.log('Working on file: ' + file);
          uploadFile(file, cb);
        }, function (err) {
          console.log('DONE!');
        })
      });
    }
  ],
  function (err) {
    console.log('DONE!');
  });
