const express = require('express');
const passport = require('passport');
const session = require('express-session');
const e = require('express');
const bodyParser = require('body-parser');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
require('dotenv').config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
}, function(accessToken, refreshToken, profile, cb) {
    cb(null, profile);
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

app.get('/auth/google', 
    passport.authenticate('google', { 
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 
            'https://www.googleapis.com/auth/userinfo.email'] 
}));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/portfolio');
    }
);

const ensureAdmin1 = (req, res, next) => {
    if (req.isAuthenticated() && req.user.emails[0].value === process.env.ADMIN1) {
        return true;
    }
};

const ensureAdmin2 = (req, res, next) => {
    if (req.isAuthenticated() && req.user.emails[0].value === process.env.ADMIN2) {
        return true;
    }
};


app.get('/portfolio', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
      }
      if(req.user.displayName){
          return res.render('portfolio', { username: req.user.displayName });
      }
      res.render('portfolio', { username: req.user.username });
    });


let aboutJuan="I’m a student at the British Columbia Institute of Technology (BCIT), currently pursuing a diploma in Computer Information Technology. My academic journey has been fueled by a deep passion for technology and innovation, with a particular focus on web development. While I enjoy all aspects of creating web applications, I find backend development especially fulfilling. Building functional, user-focused features and crafting efficient, scalable systems are where I thrive.<br><br>I enjoy exploring new programming languages, frameworks, and tools to expand my skill set and stay updated with the latest trends in technology. I am particularly drawn to problem-solving, whether it’s designing secure databases, optimizing server performance, or debugging complex issues. <br><br>When I’m not coding, I enjoy diving into tech-related discussions, learning about cloud technologies, and experimenting with personal projects that challenge my creativity and technical knowledge. My ultimate goal is to contribute to impactful projects that improve user experiences and solve real-world problems.I’m always eager to learn, grow, and collaborate with like-minded individuals in the tech community."
let aboutEddy = "I'm a student at the British Columbia Institute of Technology (BCIT), currently pursuing a diploma in Computer Information Technology. My academic journey has been fueled by a deep passion for technology and innovation, with a particular focus on database management and server administration. Throughout my studies, I have developed a solid foundation in areas such as network design and programming, which complement my specialization in databases and server systems."
app.get('/portfolio/minseuk', (req, res) => {
    const admin1 = ensureAdmin1(req);
    const admin2 = ensureAdmin2(req);
    res.render('eddy', { 
        title: 'Min Seuk Kim - Portfolio', 
        admin1,
        admin2,
        aboutEddy});
});

app.get('/portfolio/juan', (req, res) => {
    const admin1 = ensureAdmin1(req);
    const admin2 = ensureAdmin2(req);
    res.render('juan', { 
        title: 'Juan - Portfolio', 
        admin1,
        admin2,
        aboutJuan});
});

app.post('/portfolio/update/minseuk', (req, res) => {
    // Min Seuk's portfolio update logic here
    aboutEddy = req.body.aboutText;
    res.redirect('/portfolio/minseuk');
});

app.post('/portfolio/update/juan', (req, res) => {
    // Juan's portfolio update logic here
    aboutJuan = req.body.aboutText;
    res.redirect('/portfolio/juan');
});

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) console.log(err)
      });
    res.redirect('/login');
});

app.post('/portfolio/update/minseuk', ensureAdmin1, (req, res) => {
    // Min Seuk's portfolio update logic here
    res.render('eddy', { title: 'Min Seuk Kim - Portfolio' });
});

app.post('/portfolio/update/juan', ensureAdmin2, (req, res) => {
    // Juan's portfolio update logic here
    res.render('juan', { title: 'Juan - Portfolio' });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('404', { title: '404 - Page Not Found' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});