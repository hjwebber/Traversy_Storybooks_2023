const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const { db } = require('../models/User')
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {

                const newUser = {
                    googleID: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                }

                try {
                    let user = await User.findOne({ googleID: profile.id })

                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        )
    )

    //code from chatgpt
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
    //new code copied from passport documentation
    /*
        passport.serializeUser(function (user, cb) {
            process.nextTick(function () {
                return cb(null, {
                    id: user.id,
                    username: user.username,
                    picture: user.picture
                });
            });
        });
    */

    //new code copied from a YT comment:
    /* passport.deserializeUser(async function (id, done) {
         try {
             const user = await User.findById(id);
             done(null, user);
         } catch (err) {
             console.error(err);
         }
     });
 
     //new code copied from passport documentation
     /*
        passport.deserializeUser(function (user, cb) {
            process.nextTick(function () {
                return cb(null, user);
            })
        })
    */

    //Depricated Code? from original tutorial:
    /*
        passport.serializeUser((user, done) => {
            done(null, user.id)
        })
        //I think .findById is deprecated which is why it won't load to the dashboard?
        //try converting callback to a rpomise instead
        //4:35 on tutorial video- 5:09 specifically 
        /* passport.deserializeUser((id, done) => {
             User.findById(id, (err, user) => done(err, user))
     
         }) */
}

