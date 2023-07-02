const AWS = require('aws-sdk');
require('dotenv').config();

function uploadToS3(data, filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET
    })
  
    
      var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
      }
  
  
      return new Promise((resolve, reject)=> {
        s3bucket.upload(params, (err, data)=> {
          if(err){
            console.log("somthing went wrong");
            reject(err);
          }else{
            console.log("success", data);
            resolve(data.Location);
          }
        });
      })
      
    
  }
  
  
  exports.uploadFileToAws = async (req, res) => {
    try{
        const file = req.file;
        const filePath = file.path;
      
        // Read the file data
        const fileData = require('fs').readFileSync(filePath);
  
      const filename = file.originalname;
      const fileUrl = await uploadToS3(fileData, filename);
      
      res.status(200).json({fileUrl: fileUrl, success: true});
    }catch(err){
      res.status(500).json({fileUrl: "", success: false});
    }
    
  }