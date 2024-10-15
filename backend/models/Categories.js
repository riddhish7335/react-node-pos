const db = require("../config/db");

const Categories = {};

Categories.getCategories = async ( params , callback) => {

    const { page , limit , search } = params;
    const offset = ( page - 1 ) * limit;
    let searchParams = [];

    let createdByName = "(SELECT CONCAT(first_name,' ',last_name) FROM users WHERE users.id=categories.created_by) as created_by_name";
    let dbQry = "SELECT id,name,"+createdByName+" FROM categories WHERE 1";
    if(search){
        dbQry += " AND name LIKE ?";
        searchParams.push(`%${search}%`);
    }    
    dbQry += ` LIMIT ? OFFSET ?`;
    db.query(dbQry , [searchParams, limit,offset ] , async (err, categories) => {
        if(err){
            return await callback(err,null)
        } else{
            let dbTotalRecordsQry = "SELECT count(id) as total_rows FROM categories WHERE 1";
            if(search){
                dbTotalRecordsQry += " AND name LIKE ?";                 
            } 
            db.query(dbTotalRecordsQry , [searchParams ] , async (err, totalRecords) => {
                if(err){
                    return await callback(err,null)
                }else{
                     
                    let response = {
                        "categories":categories,
                        "totalRows" : totalRecords[0].total_rows
                    }
                    return callback(null,response);
                }
            })
        }
    });
}

Categories.create = async ( categoryData, callback ) => {

    let categoryName = categoryData.name;

    let insertData = {
        "name" : categoryData.name,
        "created_by" : categoryData.userId
    }

    /* Check Duplication of category name [starts] */

    let checkDuplicateQry = "SELECT id FROM categories WHERE name=?";
    db.query(checkDuplicateQry,[categoryName], async(err, result) => {

        if(err){
            return await callback(err,null);
        }

        if(result[0]){
            return await callback("Category is already exists",null);
        }else{
            let insertQry = "INSERT INTO categories SET ?";
            db.query(insertQry , insertData , async (err , result) => {
                if(err){
                    return await callback(err,null);
                }else{
                    return await callback(null,result);
                }
            })
        }



    })

    /* Check Duplication of category name [ends] */

}

module.exports = Categories;