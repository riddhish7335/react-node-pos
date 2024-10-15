const express = require("express");
const Categories = require("../models/Categories");

exports.getAllCategories = (req, res) => {
    
    const token = req.header("Authorization");
    if(!token || token == ""){
        return res.status(400).json( { "message" : "Invalid token."});
    }
    const {page , search } = req.body
    const limit = 10;
    const params = {
        "page" : page,
        "limit" : limit,
        "search" : search
    }
    Categories.getCategories( params , (err, results) => {
        if(err){
            return res.status(400).json({ "message" : err})
        }else{
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const totalCount = results.totalRows
            resData = {
                status:1,
                message:"Categories data",
                page: pageInt,
                limit: limitInt,
                totalPages: Math.ceil(totalCount / limitInt),
                totalCount:totalCount,
                data:results.categories
            }
            res.json(resData);
        }
    })
    
}


exports.createCategory = ( req,res ) => {

    const token = req.header("Authorization");

    if(!token || token == ""){
        return res.status(400).json( { "message" : "Invalid token."});
    }

    const { name } = req.body;

    if(!name || name == ""){
        return res.status(400).json( { "message" : "Enter category name"});
    }   

    const insertData = {
        "name" : name,
        "userId" : req.user.id,
    }

    Categories.create( insertData , async( err, result) => {
        if(err){
            return res.status(400).json({ "message" : err})
        }
        return await res.status(201).json( { "message" : "Category has been created successfully."}); 
    }) 


}