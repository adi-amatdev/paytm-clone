const express = require("express"); 
const zod = require('zod');
const {User} = require('../db')

const router = express.Router();    


const signUpSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstname: zod.string().min(3),
    firstlastname: zod.string().min(3),
});

router.post('/signup',async(req,res)=>{
    const body = req.body;
        const {success} = signUpSchema.safeParse(body);
        if(! success ){
            res.status(411).json({message:"Email already taken / Incorrect inputs"});
        }
        if(await User.findOne({username:body.username})){
            res.status(411).json({message:"Email already taken / Incorrect inputs"});
        }
        res.status(400).json({message:"Unknown error occured"});
})


module.exports = router