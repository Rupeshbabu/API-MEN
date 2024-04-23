const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

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

//START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err =>{
  console.log('UNHANDLER REJECTION. Shutting down...!');
  console.log(err);
  server.close(() =>{
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION. Shutting down...!');
  console.log(err.name, err.message);
  server.close(() =>{
    process.exit(1);
  });
})