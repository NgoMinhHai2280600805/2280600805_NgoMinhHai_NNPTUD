var express = require('express');
var router = express.Router();

let roleModel = require('../schemas/roles')
let userModel = require('../schemas/users')

/* =========================
   CREATE ROLE
========================= */
router.post('/', async function(req,res){
    try{
        let newRole = new roleModel({
            name:req.body.name,
            description:req.body.description
        })

        await newRole.save()
        res.send(newRole)
    }catch(err){
        res.status(400).send(err.message)
    }
})

/* =========================
   GET ALL ROLES
========================= */
router.get('/', async function(req,res){
    let data = await roleModel.find()
    res.send(data)
})

/* =========================
   GET USERS BY ROLE ID
   /roles/:id/users
========================= */
router.get('/:id/users', async function(req,res){
    try{
        let data = await userModel.find({
            role:req.params.id,
            isDeleted:false
        }).populate({
            path:'role',
            select:'name'
        })

        res.send(data)
    }catch(err){
        res.status(404).send(err.message)
    }
})

/* =========================
   GET ROLE BY ID
========================= */
router.get('/:id', async function(req,res){
    try{
        let result = await roleModel.findById(req.params.id)
        res.send(result)
    }catch(err){
        res.status(404).send(err.message)
    }
})

/* =========================
   UPDATE ROLE
========================= */
router.put('/:id', async function(req,res){
    try{
        let result = await roleModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

/* =========================
   DELETE ROLE
========================= */
router.delete('/:id', async function(req,res){
    try{
        let result = await roleModel.findByIdAndDelete(req.params.id)
        res.send(result)
    }catch(err){
        res.status(404).send(err.message)
    }
})

module.exports = router;