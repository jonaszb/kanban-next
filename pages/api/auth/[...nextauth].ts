import { GetServerSidePropsContext, NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { getServerSession, NextAuthOptions, Session, User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import dotenv from 'dotenv';
import { prisma } from '../../../utils/db';
dotenv.config();

export const options = {
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: 'Kanban Login',
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
        session({ session, user }: { session: Session; user: User }) {
            session = {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                },
            };
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
} satisfies NextAuthOptions;
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

export function auth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, options);
}
