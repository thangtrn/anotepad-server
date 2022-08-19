import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Pleas enter your email.']
    },
    password: {
        type: String,
        required: [true, 'Pleas enter your password.'],
        minLength: 6
    },
    secret: {
        type: String,
        required: [true, 'Pleas enter your secret questions.']
    }
}, {
    timestamps: true
})

export default mongoose.model('Users', userSchema)