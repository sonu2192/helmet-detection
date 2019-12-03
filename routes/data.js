const router=require('express').Router();
const modal=require('../modals/trafficdata');
router.route('/saveInfo').get((req,res)=>{
    const rider=new modal({
        bikeno:"AK462",
        name:"sonu",
        email:"satya123@gmail.com",
        Photoname:"sunny.jpg"
    })
    rider.save()
    .then(msg=>{
        console.log("saved "+msg.name);
    })
    .catch(err=>{
        console.log(err);
    })
})
router.route('/getInfo').post((req,res)=>{
    
    modal.findOne({bikeno:req.body.bikeno})
    .then(msg=>{
        res.json(msg);
    })
    .catch(err=>{
        res.end(err);
    })
})
module.exports=router;