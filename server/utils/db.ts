import mangoose, { set } from 'mongoose';
require('dotenv').config();

const dbURL = process.env.DB_URL || '';

const connectDB = async () => {
  try {
    await mangoose.connect(dbURL).then((data:any) => {
      console.log(`Data base connected with ${data.connection.host}`);
    }); 
  } catch (error:any) {
    console.log('Error connecting to the database');
    console.log(error);
    // setTimeout(connectDB, 3000);
  }
};

export default connectDB;