import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User'; // Assuming you have a User model

export function configurePassport(passport: passport.PassportStatic) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'sub', // Use 'sub' instead of 'email'
      passwordField: 'password'
    },
    async (sub: string, password: string, done) => {
      try {
        const user = await User.findOne({ sub });
        if (!user) {
          return done(null, false, { message: 'Incorrect subject identifier.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    console.log('serialize user', user)
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log('deserialize user', id)
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
