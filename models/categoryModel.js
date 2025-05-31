const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    image:{
        type:DataTypes.STRING(30),
        allowNull:false,
        unique:true
    }
}, {
    tableName: 'Categories',
    timestamps: true
});

module.exports = { Category };
