import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { query } from 'faunadb';

import { fauna } from '../../../service/fauna';
import { session } from 'next-auth/client';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session(session) {

      try {
        const activeSubscription = await fauna.query(
          query.Get(
            query.Intersection([
              query.Match(
                query.Index('subscription_by_user_ref'),
                query.Select("ref",
                  query.Get(
                    query.Match(
                      query.Index('user_by_email'),
                      query.Casefold(session.user.email)
                    )
                  )
                )
              ),
              query.Match(
                query.Index('susbcription_by_status'), 'active'
              )
            ])
          )
        )

        console.log(activeSubscription);
        
        return {
          ...session,
          activeSubscription

        }

      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }

    },

    async signIn(user, account, profile) {

      const { email } = user;

      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(user.email)
                )
              )
            ),
            query.Create(
              query.Collection('users'),
              { data: { email } }
            ),
            query.Get(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(user.email)
              )
            )
          )
        )

        return true;
      } catch {
        return false;
      }
    }
  }
})