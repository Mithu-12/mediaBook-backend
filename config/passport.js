import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from '../models/User.js';
import dotenv from 'dotenv'

dotenv.config()
passport.use(
  new GoogleStrategy(
    {
      clientID: '776491034035-2eabqc9ja4je7m34o78lp59lr07nubju.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://fierce-pear-pelican.cyclic.app/api/auth/google/callback',
      
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('Google OAuth2 strategy called');
      try {
        // Check if the user already exists in database
        let user = await User.findOne({ googleId: profile.id });
        // console.log(profile);
        if (!user) {
          // Create a new user if not found
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            userName: profile.emails[0].value,
          });
        }
       

        // Call done with null for the error and the user object
        return done(null, user);
      } catch (error) {
        // Call done with the error object and false for the user
        console.log('new error', error)
        return done(error, false);
      }
    }
  )
);




passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});













