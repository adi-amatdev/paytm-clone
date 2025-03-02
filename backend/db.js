const mongoose = require('mongoose');

try{
    mongoose.connect('mongodb://localhost:27017/patym-clone');

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

const User = mongoose.model('User', userSchema);

module.exports = {
    User 
}