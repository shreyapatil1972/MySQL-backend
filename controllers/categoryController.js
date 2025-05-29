const {Category} = require('../models/categoryModel')

createCategory = async (req,res) => {
    const {name} = req.body;
    const image = req.file ? req.file.filename : null;
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).send({ message: "Category already exists", success: false });
        }
        const newCategory = await Category.create({name})
        res.status(200).send({message:'category created successfully ',success:true})
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send({error:error})
    }
}

getAllCategories= async (req,res) => {
    try {
        const categories = await Category.findAll()
        const modifiedCategories = categories.map((category)=>({
            id:category.id,
            name:category.name,
            image:`http://localhost:7000/uploads/${category.image}`
        }))
        res.status(200).send({success:true,categories:modifiedCategories})
    } catch (error) {
        res.status(500).send({error:error})
    }
}

getCategoryByID = async (req,res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id); 
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }
         modifiedCategory = {
            id:category.id,
            name:category.name,
            image:`http://localhost:3000/uploads/${category.image}`
        }
        res.status(200).send({success:true, category})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
}

updateCategory = async (req,res) => {
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }
        category.name = name;
        await category.save();
        res.status(200).send({success:true, message:'Category updated successfully', category})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
}

deleteCategory = async (req,res) => {
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }
        await category.destroy();
        res.status(200).send({success:true, message:'Category deleted successfully'})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
}
module.exports = {
    createCategory,
getAllCategories,
getCategoryByID,
updateCategory,
deleteCategory,
}