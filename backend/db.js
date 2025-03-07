const mongoose = require('mongoose');

try{
    mongoose.connect('mongodb+srv://aaditya:DBBvydKF6UE660WB@cluster0.r3thrl3.mongodb.net/patym-clone');

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