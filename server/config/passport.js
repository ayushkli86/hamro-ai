import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import AppleStrategy from 'passport-apple'
import User from '../models/User.js'
import logger from './logger.js'

export function initPassport() {
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
  })

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id })
        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.name?.givenName || 'Google User',
            email: profile.emails?.[0]?.value,
            googleId: profile.id,
            emailVerified: true,
            authProvider: 'google',
          })
          logger.info({ userId: user._id }, 'User created via Google OAuth')
        }
        done(null, user)
      } catch (err) {
        done(err, null)
      }
    }))
    logger.info('Google OAuth strategy initialized')
  } else {
    logger.warn('Google OAuth not configured — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET')
  }

  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
    passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/api/auth/apple/callback',
    }, async (accessToken, refreshToken, idToken, profile, done) => {
      try {
        const appleId = idToken?.sub || profile?.id
        if (!appleId) return done(new Error('No Apple ID returned'), null)
        let user = await User.findOne({ appleId })
        if (!user) {
          user = await User.create({
            name: profile?.name?.firstName ? `${profile.name.firstName} ${profile.name.lastName || ''}`.trim() : 'Apple User',
            email: profile?.email,
            appleId,
            emailVerified: true,
            authProvider: 'apple',
          })
          logger.info({ userId: user._id }, 'User created via Apple OAuth')
        }
        done(null, user)
      } catch (err) {
        done(err, null)
      }
    }))
    logger.info('Apple OAuth strategy initialized')
  } else {
    logger.warn('Apple OAuth not configured — set APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY')
  }
}
