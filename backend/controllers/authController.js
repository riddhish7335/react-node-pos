const express = require("express");
const Users = require("../models/Users");
const jwt = require('jsonwebtoken');
exports.createAdmin = async (req,res) => {
    const { first_name, last_name, email_address, password } = req.body;
   
    if(!first_name || first_name == ""){
        
        return res.status(400).json( { "message" : "Enter first name."});
    } 

    if(!last_name || last_name == ""){
        return res.status(400).json( { "message" : "Enter last name."});
    }

    if(!email_address || email_address == ""){
        return res.status(400).json( { "message" : "Enter email address."});
    }

    if(!password || password == ""){
        return res.status(400).json( { "message" : "Enter password."});
    }else if(password.length < 8){
        return res.status(400).json( { "message" : "Password must be atleast 8 characters long."});    
    }

    const inserData = {
        "first_name" : req.body.first_name,
        "last_name" : req.body.last_name,
        "email_address" : req.body.email_address,
        "password" : req.body.password,
    }

    Users.create( inserData, async (err , result) =>{
        if(err){
            return await res.status(400).json( { "message" : err});
        }
        
        return await res.status(201).json( { "message" : "User has been created successfully."});
    });

}

exports.login = async (req,res) => {

    const { email_address , password } = req.body;

    if(!email_address || email_address == ""){
        return await res.status(400).json( { "message" : "Enter email address"});
    }

    if(!password || password == ""){
        return await res.status(400).json( { "message" : "Enter password"});
    }

    loginCredential = {
        "email_address" : email_address,
        "password" : password
    }

    Users.login( loginCredential , async (err, user) => {
        if(err){
            return await res.status(501).json( { "message" : err });
        }else{

            const payload = { user: { id: user.id } };


            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
        
            const data = {
                name: user.first_name +" "+ user.last_name,
                token: token
            }

            res.status(200).json({
                message: 'Login successfully',
                data: data,
            });
        }
    })



}


exports.getProfile = async ( req , res) => {
    const userId = req.user.id;
    
    
    res.status(200).json({
        message: 'User Profile Data',
        data: userId,
    });
};