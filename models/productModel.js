const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const {Brand} = require("./brandModel")
const {Category} = require('./categoryModel')

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Instock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    image:{
        type:DataTypes.STRING(30),
        allowNull:false,
        unique:true
    }
}, {
    tableName: 'Product',
    timestamps: false // Sequelize will auto-create createdAt and updatedAt
});

Product.belongsTo(Brand,{
    foreignKey:'Brand_id',
    as:'Brands'
})

Product.belongsTo(Category,{
    foreignKey:'Category_id',
    as:'Categories'
})


module.exports = { Product };
