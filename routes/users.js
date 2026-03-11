var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users')

// GET ALL (query username)
router.get('/', async function(req,res){

    let usernameQ = req.query.username 
        ? req.query.username.toLowerCase() 
        : ''

    let data = await userModel.find({
        isDeleted:false,
        username:new RegExp(usernameQ,'i')
    }).populate({
        path:'role',
        select:'name'
    })

    res.send(data)
})

// GET BY ID
router.get('/:id', async function(req,res){
    try{
        let result = await userModel.findById(req.params.id)
        res.send(result)
    }catch(err){
        res.status(404).send(err.message)
    }
})

// CREATE
router.post('/', async function(req,res){

    let newUser = new userModel({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        fullName:req.body.fullName,
        role:req.body.role
    })

    await newUser.save()
    res.send(newUser)
})

// UPDATE
router.put('/:id', async function(req,res){

    let result = await userModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )

    res.send(result)
})

// DELETE (soft)
router.delete('/:id', async function(req,res){

    let result = await userModel.findById(req.params.id)
    result.isDeleted = true
    await result.save()

    res.send(result)
})

router.post('/enable', async function(req,res){

    let result = await userModel.findOne({
        email:req.body.email,
        username:req.body.username
    })

    if(!result){
        return res.status(404).send("User not found")
    }

    result.status = true
    await result.save()

    res.send(result)
})

router.post('/disable', async function(req,res){

    let result = await userModel.findOne({
        email:req.body.email,
        username:req.body.username
    })

    if(!result){
        return res.status(404).send("User not found")
    }

    result.status = false
    await result.save()

    res.send(result)
})

module.exports = router