const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../../db/mysql');
const bcrypt = require('bcrypt'); 

// Passport local strategy for login (username or email)
passport.use(new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    function (username, password, done) {
        connection.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username],
            async (err, results) => {
                if (err) return done(err);
                if (results.length === 0) return done(null, false, { message: 'Incorrect username or email.' });

                const user = results[0];
                const match = await bcrypt.compare(password, user.password);
                if (!match) return done(null, false, { message: 'Incorrect password.' });

                return done(null, user);
            }
        );
    }
));

// Serialize and deserialize user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    connection.query('SELECT * FROM users WHERE id = ?', [id], function (err, results) {
        if (err) return done(err);
        done(null, results[0]);
    });
});

module.exports = passport;