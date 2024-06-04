import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectToDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(connectionInstance.connection.host);
        console.log("Connected to mongodb");
        return connectionInstance;
    } catch (error) {
        console.log("Connection to db failed");
        process.exit(1);
    }
}