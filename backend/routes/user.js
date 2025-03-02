const express = require("express"); 
const zod = require('zod');
const {User} = require('../db')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config')

const router = express.Router();    


const signUpSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string().min(3),
    lastName: zod.string().min(3),
});

const signInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post('/signup',async(req,res)=>{
        try {
            const body = req.body;
            const {success} = signUpSchema.safeParse(body);
            if(! success ){
                console.log(success);
                return res.status(411).json({message:"Email already taken / Incorrect inputs"});
            }
            if(await User.findOne({username:body.username})){
                return res.status(411).json({message:"Email already taken / Incorrect inputs"});
            }
            const user = User(body);
            await user.save();
            const id = user._id; 
            const token = jwt.sign({id},JWT_SECRET);
            return res.status(200).json({message: "User created successfully",token:token})
        } catch (error) {
            console.log(error)
            return res.status(411).json({message:error});
        }
})

router.post('/signin',async(req,res)=>{
    try {
        const {success} = signInSchema.safeParse(req.body);
        if(!success){
            return res.status(411).json({message:"Error while logging in"});
        }
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if ( !user ){
            return res.status(411).json({message:"Error while logging in"})
        }
        if(user.password !== password){
            return res.status(411).json({message:"Error while logging in"});
        }
        const id = user._id;
        const token = jwt.sign({id},JWT_SECRET)
        return res.status(200).json({token:token});
    } catch (error) {
        return res.status(411).json({message:"Error while logging in"})
    }
})

module.exports = router