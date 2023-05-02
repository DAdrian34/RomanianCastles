if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const session = require('express-session');
import('ejs-lint');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const usersRoutes = require('./routes/users');
const castlesRoutes = require('./routes/castles');
const reviewsRoutes = require('./routes/reviews');

const MongoStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL;
// 'mongodb://127.0.0.1:27017/castles' 

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://Adrian_Daraban:Jq7xIC3xRo6kGpky@cluster1.2pentmq.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'secretcookie';

const store = new MongoStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("Store error", e)
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/castles', castlesRoutes);
app.use('/castles/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);


app.get('/', (req, res) => {
    res.render('./home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log(`Listen on port ${port}`)
})