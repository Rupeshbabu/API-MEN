/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const path = require('path');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const viewRoutes = require('./routes/viewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//GLOBAL - MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// SET Security HTTP Headers
app.use(helmet());

//Limits requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    mesaage: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api', limiter);


app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xssClean());

// Prevent parameter pollution
app.use(hpp());

// app.use(express.static(`${__dirname}/public`));  //run static html files in browser
app.use(express.static(path.join(__dirname, 'public')));  //run static html files in browser


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
app.use('/api/v1/reviews', reviewRouter);
app.use('/', viewRoutes);

//404 - page not found 
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status:'fail',
    //     message:`Can't find ${req.originalUrl} on this server!`
    // });

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handling for middleware
app.use(globalErrorHandler);

module.exports = app;
