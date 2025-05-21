const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            // SSL options can go here
        },
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        await sequelize.sync({ alter: false }); // alter:false = safer in prod ******Important******
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

connectDB();

module.exports = sequelize
