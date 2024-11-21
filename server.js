const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
require('dotenv').config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://group3.com/auth/google/callback'
}, function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    if (req.user && req.user.displayName) {
        res.redirect('/portfolio');
    } else {
        res.render('index', { title: 'Group 3 - Portfolio', salut: 'Welcome to Group 3 Portfolio. Please log in.' });
    }
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/portfolio');
    }
);

app.get('/portfolio', (req, res) => {
    if (req.user && (req.user.emails[0].value === 'admin1@example.com' || req.user.emails[0].value === 'admin2@example.com')) {
        res.render('portfolio', { title: 'Group 3 - Portfolio', username: req.user.displayName });
    } else {
        res.redirect('/login');
    }
});

app.get('/portfolio/minseuk', (req, res) => {
    res.render('minseuk', { title: 'Min Seuk Kim - Portfolio' });
});

app.get('/portfolio/juan', (req, res) => {
    res.render('juan', { title: 'Juan - Portfolio' });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('404', { title: '404 - Page Not Found' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});