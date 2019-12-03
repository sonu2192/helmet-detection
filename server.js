const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser=require('body-parser');
const TrafficRoute=require('./routes/data');
const multer=require('multer');
const bikeModel=require('./modals/trafficdata');
const mailer=require('./routes/sendmail');
const nodemailer=require('nodemailer');

//set Storage engine
var fname='';
const storage=multer.diskStorage({
  destination:'./public/uploads',
  filename:function(req,file,cb){
    fname=Date.now()+'-'+file.originalname;
    cb(null,fname);
  }
})
var upload=multer({storage:storage}).single('file');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
const url = 'mongodb+srv://dbuser:Saikumar123@cluster0-osfug.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology:true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database connected successfully");
});
app.post('/upload',function(req, res) {
     
  upload(req, res, function (err) {
         if (err instanceof multer.MulterError) {
             return res.status(500).json(err)
         } else if (err) {
             return res.status(500).json(err)
         }
    return res.status(200).send(req.file)

  })
  app.post('/update',(req,res)=>{
    bikeModel.updateOne({bikeno:req.body.bikeno},{$set:{Photoname:fname,message:req.body.message}})
    .then(msg=>{
      res.end("File uploaded successfully");
    })
    .catch(err=>{
      res.end("Some error occured");
    })
  })
});
app.post('/mail',(req,res)=>{
  let requiredpath='./public/uploads/'+fname;
  let transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'rapeti.saikumar2@gmail.com',
        pass:'Saikumar123@'
    }
  });
  
  let mailOptions={
    from:'rapeti.saikumar2@gmail.com',
    to:req.body.bikes.email,
    subject:'Traffic Police',
    text:req.body.message,
    attachments:[{
      filename:fname,
      path:requiredpath
    }]
  }
  transporter.sendMail(mailOptions,(err,data)=>{
    if(err)
    {
        res.end(err);
    }
    else
    {
        res.end("sent the data succesfully");
    }
});
})
app.use('/traffic',TrafficRoute);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.listen(port, () => {
  console.log(`server is running on port:${port}`);
});
