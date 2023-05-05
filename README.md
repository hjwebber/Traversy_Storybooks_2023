# Traversy_Storybooks_2023
# Storybook project by Travery Media- updated 2023
> I recently completed the Storybooks tutorial by Traversy Media on Youtube as part of my curriculum for 100devs,
and found that it needs some updates since it has been 3 years since the tutorial came out. 
This repo is for my fellow 100devs classmates or for anyone else who wanted to do this tutorial in 2023!
Most of these updates were discovered by 100Devs Streamteam member, MayanWolfe, but there have been a few more necessary updates since their stream last year, which I added.

All changes are marked in the code with //!Change, and I will also explain those changes below.



The original video tutorial: 
https://www.youtube.com/watch?v=SBvmnHTQIPY&t=259s

MayanWolfe's GH Repo: https://github.com/Mayanwolfe/Traversy_CRUD_Auth

Brad Travery's GH Repo: https://github.com/bradtraversy/storybooks

This is an AMAZING tutorial if you want to learn the entire process of building a full-stack web application, so I wanted to make sure it was up-to-date and still available as a learning tool. 


## Installation

    npm install 
    

# Run in development

    
    npm run dev

# Run in production

    npm start

# Code Changes:

in `config/db.js`:


 See below change:

    
      const connectDB = async () => {
    try {
        //!Change: Additional properties not required
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }}

    

in `config/passport.js`:


 In the current version of Passport (Passport.js v0.4.1), the recommended approach for serializing and deserializing users is to use passport.serializeUser with an async function and passport.deserializeUser with an async function or a Promise-based approach.:

    
       
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

in `models/Story.js`:


 See below change:

    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //!Change: this field should be required because the app will break if the user is not present.
        required: true,
    },

in `routes/auth.js`:

Passport 0.6 requires logout to be async:

  
    
    
    
    router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });

in `routes/stories.js`:
 
 .remove() is depricated and needs to be replaced with .deleteOne():

    
      router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
    
    

in `stories/show.hbs`:

 add 'referrerpolicy="no-referrer"' to stop Google from blocking access to the profile
                images:

    
       <img src="{{story.user.image}}" referrerpolicy="no-referrer" class="circle responsive-img img-small">



in `app.js`:
 
      const path = require('path')
      const express = require('express')
      //!Change: Mongoose is not longer required
      //const mongoose= require('mongoose)
      const dotenv = require('dotenv')
      const morgan = require('morgan');
      const exphbs = require('express-handlebars');
      const methodOverride = require('method-override')
      const passport = require('passport');
      const session = require('express-session')
      //!Change: MongoStore does not require (session) 
      const MongoStore = require('connect-mongo')//(session)
      const connectDB = require('./config/db')
      
      
      
  Add '.engine' after exphbs:
  
        exphbs.engine({
              helpers: {
                  formatDate,
                  stripTags,
                  truncate,
                  editIcon,
                  select
              },
              
              
 MongoStore Syntax has changed:
 
        app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        //!Change: MongoStore syntax has changed
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    }))






