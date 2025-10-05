import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email not provided"],
        index: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        lowercase: true,
        trim: true,
        required:  [true, "username not provided"]
    },
    password: {
        type: String,
        required:  [true, "password not provided"],
        trim: true
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo"
    }]
},
{
    timestamps: true
}
);

userSchema.pre("save",async function(next){
    if(! this.isModified("password") ) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    const payload = {
        _id: this._id,
        name:this.name,
        email:this.email
    };
    const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'});
    return token;
};

export const User = mongoose.model("User", userSchema);
