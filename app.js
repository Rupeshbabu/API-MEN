const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


const app = express();

//MIDDLEWARES
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));  //run static html files in browser

// app.use((req, res, next) =>{
//     console.log('Hello from the middleware :) :(');
//     next();
// });

// app.use((req, res, next) =>{
//     req.requestTime = new Date().toISOString();
//     next();
// });


//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//404 - page not found 
app.all('*', (req, res, next) =>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`Can't find ${req.originalUrl} on this server!`
    // });

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handling for middleware
app.use(globalErrorHandler);

module.exports = app;
