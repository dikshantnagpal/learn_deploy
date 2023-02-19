const express=require("express")
const {noteModel}=require("../model/Note.model")
const noteRouter=express.Router()

noteRouter.get("/",async(req,res)=>{
    try{
        const notes = await noteModel.find()
        res.send(notes)
    }catch(err){
        res.send({ "msg": "something went wrong", "error": err.message })
    }
    
})

noteRouter.post("/create",async(req,res)=>{
    const payload=req.body
    try{
        const note = new noteModel(payload)
        await note.save()
        res.send({ "msg": "note created" })
    }catch(err){
        res.send({"msg":"something went wrong","error":err.message})
    }
    
})

noteRouter.delete("/delete/:id", async(req, res) => {
    const noteID = req.params.id
    const note = await noteModel.findOne({ "_id": noteID })
    const userID_in_note = note.userID
    const userID_making_req = req.body.userID
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "msg": "you re not authorized" })
        } else {
            await noteModel.findByIdAndDelete({ _id: noteID })
            res.send({ "msg": `note with id:${noteID} has been deleted` })
        }
    } catch (err) {
        res.send({ "msg": "something went wrong", "error": err.message })
    }
})

noteRouter.patch("/update/:id", async (req, res) => {
    const noteID = req.params.id
    const payload=req.body
    const note=await noteModel.findOne({"_id":noteID})
    const userID_in_note=note.userID
    const userID_making_req=req.body.userID
    try {
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"you re not authorized"})
        }else{
            await noteModel.findByIdAndUpdate({ _id: noteID }, payload)
            res.send({ "msg": `note with id:${noteID} has been updated` })
        }   
    } catch (err) {
        res.send({ "msg": "something went wrong", "error": err.message })
    }
})

module.exports={
    noteRouter
}