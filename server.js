const express = require('express');
const app = express();

app.set('view engine', 'ejs');
require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://group3.com/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

const session = require('express-session');
app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
        res.render('index', { title: 'Group 3 - Portfolio', salut: 'Welcome to Group 3 Portfolio. Please log in.' });
    }
);

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
    if (req.user && (req.user.emails[0].value === ADMIN1 || req.user.emails[0].value === 'admin2@example.com')) {
        res.render('portfolio', { title: 'Group 3 - Portfolio', username: req.user.displayName });
    } else {
        res.redirect('/login');
    }
});

app.get('/portfolio/minseuk', (req, res) => {
    res.render('eddy', { title: 'Min Seuk Kim - Portfolio' });
});

app.get('/portfolio/juan', (req, res) => {
    res.render('juan', { title: 'Juan - Portfolio' });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});