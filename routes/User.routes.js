const express=require("express")
const {userModel}=require("../model/User.model")
const userRouter=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

userRouter.post("/register",async(req,res)=>{
    const {name,email,pass}=req.body
    try{
        bcrypt.hash(pass, 5, async(err, hash)=> {
            if(err){
                res.send(err.message)
            }else{
                const user = new userModel({name,email,pass:hash})
                await user.save()
                res.send({ "msg": "new user has been registered" })
            }
            // Store hash in your password DB.
        })
        
    }catch(err){
        res.send({ "msg": "Something went wrong","error":err.message })
    }
    
})

userRouter.post("/login", async(req, res) => {
    const {email,pass} = (req.body)
    try{
        const user=await userModel.find({email})
        if(user.length>0){
            bcrypt.compare(pass, user[0].pass,(err, result)=>{
                if(result){
                    let token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        userID: user[0]._id
                    }, "masai")
                    res.send({ "msg": "logged in", "token": token })
                }else{
                    res.send({ "msg": "wrong credentials" })
                }
            });
            
        }else{
            res.send({ "msg": "wrong credentials" })
        }
    }catch(err){
        res.send({ "msg": "something went wrong","error":err.message })
    }
})

module.exports={
    userRouter
}
