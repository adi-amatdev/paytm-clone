const express = require("express"); 
const zod = require('zod');
const {User, Account} = require('../db')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config');
const { authMiddleware } = require("../middlewares/authMiddleware");

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

const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.post('/signup',async(req,res)=>{
        try {
            const body = req.body;
            const {success} = signUpSchema.safeParse(body);
            if(! success ){
                return res.status(411).json({message:"Email already taken / Incorrect inputs"});
            }
            if(await User.findOne({username:body.username})){
                return res.status(411).json({message:"Email already taken / Incorrect inputs"});
            }
            const user = User(body);
            await user.save();
            const id = user._id; 
            await Account.create({
                userId: id,
                balance: 1+Math.random()*10000
            });
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

router.put('/update',authMiddleware,async(req,res)=>{
    try {
        const {success} = updateSchema.safeParse(req.body);
        if(!success){
            return res.status(411).json({
                message:"Error while updating information"
            })
        }
        await User.updateOne({_id:req.id},req.body);
        return res.status(200).json({message:"Updated successfully"})
        
    } catch (error) {
        return res.status(500).json({message:"Error while updating information"});
    }
});

router.get('/bulk',async (req,res)=>{
    const filter = req.query?.filter || "";
    const result = await User.find({
        $or:[
            {
                firstName:{
                    "$regex":filter
                }
            },
            {
                lastName:{
                    "$regex": filter
                }
            }
        ]
    });
    res.status(200).json({
        result: result.map((user)=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            id:user._id
        }))
    })
})
module.exports = router