import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    phone:{
        type:String,
    },
    role:{
        type:String,
        default: 'applicant',
        enum: ['applicant', 'admin']
    },
    skills:[{
        type: String
    }],
    portfolio: {
        type: String
    },
    github: {
        type: String
    },
    linkedin: {
        type: String
    },
    resume: {
        type:String
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;