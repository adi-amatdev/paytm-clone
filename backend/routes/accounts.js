const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { Account, User } = require('../db');
const { default: mongoose } = require('mongoose');
const router = express.Router();


router.get('/balance',authMiddleware,async(req,res)=>{
    try {
        const result = await Account.findOne({userId:req.id});
        res.status(200).json({balance:result.balance})
    } catch (error) {
        res.status(400).json({message:"Balance not found"});
    }
})

router.post('/transfer',authMiddleware,async(req,res)=>{
    try {
        const {amount, to} = req.body;
        if(!amount || !to){
            return res.status(400).json({message:"Invalid amount or recipient"});
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        const fromUser = await Account.findOne({userId:req.id}).session(session);
        if(fromUser.balance < amount||!fromUser){
            await session.abortTransaction();
            return res.status(400).json({message:"Insufficient balance"});
        }
        const toUser = await Account.findOne({userId:to}).session(session);
        if(!toUser){
            await session.abortTransaction();
            return res.status(400).json({message:"Invalid account"});
        }

        await Account.updateOne({userId:req.id},{
            $inc:{
                balance:-amount
            }
        }).session(session);
        await Account.updateOne({userId:to},{
            $inc:{
                balance:amount
            }
        }).session(session);

        await session.commitTransaction();
        session.endSession()
        return res.status(200).json({message:"Transaction successful"})
    } catch (error) {
        console.log(error)
    }
    
})


module.exports = router;