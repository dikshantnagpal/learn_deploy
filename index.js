const express=require("express")
const {connection}=require("./Configs/db")
const {userRouter}=require("./routes/User.routes")
const {noteRouter}=require("./routes/Note.routes")
const {authenticate}=require("./middleware/authenticate.middleware")
const cors=require("cors")
const app = express()
app.use(cors({
    origin:"*"
}))
app.use(express.json())
app.get("/", (req, res) => {
    res.send("home page")
})

app.use("/users",userRouter)
app.use(authenticate)
app.use("/notes",noteRouter)




app.listen(4500,async()=>{
    try{
        await connection
        console.log("connectred to db")
    }catch(err){
        console.log(err.message)
    }
    console.log("server running at 4500")
})