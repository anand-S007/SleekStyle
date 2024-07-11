const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../models/user/user')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
},
    async (token, tokenSecret, profile, done) => {
        try {

            if (!profile.emails || !profile.emails.length) {
                throw new Error('No email found in profile');
            }
            const email = profile.emails[0].value;
            let user = await User.findOne({ email });
            if (!user) {
                console.log('entry');
                user = new User({
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    email: profile.emails[0].value,
                    isVerified: true,
                    password: "",
                    mobile: 0,
                    dob: new Date(),
                });
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error, false)
        }
    }
))
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, false);
    }
});