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
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    Category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Category_id'
    },
    Brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Brand_id'
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Quantity',
        validate: {
            min: 0
        }
    },
    Instock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'Instock'
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
