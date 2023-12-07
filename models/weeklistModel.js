import mongoose from "mongoose";


const weeklistSchema = mongoose.Schema({
    isCompleted: {
        type: Boolean,
        required: true,
    },
    markWeeklist: {
        type: Boolean,
        required: true
    },
    tasks: [
        {
            markTask: {
                type: Boolean,
                required: true
            },
            description: {
                type: String,
                required: true
            },
        }
    ],
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Weeklist = mongoose.model('weeklist', weeklistSchema);

export default Weeklist;