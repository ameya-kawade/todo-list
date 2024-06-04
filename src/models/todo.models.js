import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "task title not provided"]
    },
    status: {
        type: Boolean,
        default: false
    },
    dueTime: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
}
);

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "todo name not provided"],
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    tasks:[tasksSchema]
}, 
{
    timestamps: true
}
);


export const Todo = mongoose.model('Todo',todoSchema);