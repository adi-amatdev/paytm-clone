const mongoose = require('mongoose');
require('dotenv').config();


try{
    mongoose.connect(process.env.MONGO_URL);

}catch (err){
    console.log(err);
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    }
});

const accountsSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    balance: {
        type: Number ,
        required: true,
    }
})


const Account = mongoose.model('Account',accountsSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    User ,
    Account
}