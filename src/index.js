import { app } from "./app.js";
import { connectToDB } from "./db/db.js";

connectToDB()
.then((res)=>{
    const port = process.env.PORT || 8000;
    app.on("error",(err)=>{
        console.log(err);
        process.exit(1);
    })
    app.listen(port, ()=>{
        console.log("Server started on port :", port);
    });
})
.catch((err)=>{
    console.log(err);
})

