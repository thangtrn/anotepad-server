import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        required: true
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    }
}, {
    timestamps: true
})

export default mongoose.model('Notes', noteSchema)