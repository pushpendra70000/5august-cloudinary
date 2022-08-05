const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const {uuid} = require('uuidv4');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

require('dotenv').config();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
  });

require('./db/db.js')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
       // console.log(file);
      let randomnumber = uuid();
      let fname= randomnumber+""+file.originalname;
      cb(null, fname)
    }
  })
  
  const upload = multer({ storage })

app.post( '/fileupload',upload.single('mypic'),(req,res)=>{
    console.log(req.file.path);
    cloudinary.uploader.upload(req.file.path, function(error, result) {
        console.log(error,result);
         fs.unlink(req.file.path, function(err){
             if (err) console.log(err);
             else console.log("File Deleted");
         })
         res.status(200).json({
             msg:"File uploaded Successfully"
             
         });

    })
});

let port= process.env.port
    app.listen(port, ()=>{
        console.log('this port is running on',port)
});