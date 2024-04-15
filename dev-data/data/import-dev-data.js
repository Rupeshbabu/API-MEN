const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex:true,
    // useFindAndModify:false
  })
  .then(() => {
    console.log('DB Connection Successfully!');
  });

  //READ JSON FILE
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

  //IMPORT DATA INTO DB
  const importData = async () =>{
    try {
        await Tour.create(tours);
        console.log('Data Successfully loaded!');

    } catch (error) {
        console.log(error);
    }
    process.exit();
  };

  //DELETE ALL DATA FROM DB
  const deleteData = async () =>{
    try {
        await Tour.deleteMany();
        console.log('Data Successfully Deleted!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
  }

  if(process.argv[2] === '--import'){
    importData();
  }else if(process.argv[2] === '--delete'){
    deleteData();
  }
