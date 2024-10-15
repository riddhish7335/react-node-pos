const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = {};

Users.create = (adminData,callback) => {   

    const hashedPassword = bcrypt.hashSync(adminData.password , 8);
    
    let inserData = {
        "first_name" : adminData.first_name,
        "last_name" : adminData.last_name,
        "email_address" : adminData.email_address,
        "password" : hashedPassword,
        "type" : 2
    }

    /** check duplication for email address */
    dbQry = "SELECT id FROM users WHERE email_address=?";
    db.query(dbQry,[adminData.email_address], async (err, result) => {
        if(err){
            return await callback(err,null);
        }
        if(result[0]){
            return await callback("Email address is already exists",null);
        }else{
            dbQry = "INSERT INTO users SET ?"
            db.query(dbQry , inserData , async (err , result) => {
                if(err){
                    return await callback(err,null);
                }else{
                    return await callback(null,result);
                }
            })
        }
    })
}

Users.login = async (loginCredential, callback) => {

    const { email_address , password } = loginCredential;    

    dbQry = "SELECT id,first_name,last_name,email_address,password FROM users WHERE email_address=?";
    db.query(dbQry, [email_address] , async (err,result) => {
        if(err){
            return await callback(err,null)
        }

        if(!result[0]){
            return await callback("Invalid email address",null);
        }else{            
            let userData = result[0];
            const isPasswordValid = bcrypt.compareSync(password, userData.password);
            if (!isPasswordValid) {
                return await callback("Invalid password",null);
            }else{
                return await callback(null,userData);
            }
        }
    })
}

module.exports = Users;