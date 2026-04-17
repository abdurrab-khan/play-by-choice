import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  callbacks: {
    jwt(params) {
      console.log("JWT Callback Params:", params);
      return params.token;
    },
    session(params) {
      console.log("Session Callback Params:", params);
      return params.session;
    },
  },
  // callbacks: {
  //   async jwt({ token, account, profile }) {
  //     if (account && profile) {
  //       const user = await prismaClient.user.findFirst({
  //         where: {
  //           email: profile?.email ?? token?.email,
  //         },
  //       });

  //       if (user) {
  //         token.name = (profile as any)?.display_name ?? profile.name ?? "";
  //         token.email = profile?.email ?? "";
  //         token.id = user.id;
  //         token.image = profile?.image ?? "";
  //         token.accessToken = account?.access_token ?? "";
  //         token.refreshToken = account?.refresh_token ?? "";
  //         token.provider = account?.provider as CredentialType;
  //       }
  //     }

  //     if (account?.expires_at) {
  //       token.accessTokenExpires = account.expires_at * 1000;
  //     }

  //     if (
  //       token.accessTokenExpires &&
  //       Date.now() >= token.accessTokenExpires - 2 * 60 * 1000
  //     ) {
  //       if (token.provider === "spotify") {
  //         return refreshAccessToken(token);
  //       } else if (token.provider === "google") {
  //         return refreshGAccessToken({ token });
  //       }
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token) {
  //       if (session && session.user) {
  //         session.user.email = token?.email ?? "";
  //         session.user.id = token.id ?? "";
  //         session.user.name = token.name ?? "";
  //         session.user.accessToken = token.accessToken ?? "";
  //         session.user.refreshToken = token.refreshToken ?? "";
  //         session.user.provider = token.provider ?? "";
  //         session.user.accessTokenExpires =
  //           token.accessTokenExpires ?? undefined;
  //       }
  //     }
  //     return session;
  //   },
  //   async signIn({ account, profile }) {
  //     try {
  //       const isUserExits = await prismaClient.user.findFirst({
  //         where: {
  //           email: profile?.email,
  //         },
  //       });
  //       if (
  //         isUserExits &&
  //         (isUserExits?.provider).toLowerCase() !==
  //           account?.provider?.toLowerCase()
  //       ) {
  //         return `/sign-in?error=login-with-other-provider&provider=${isUserExits.provider}`;
  //       }

  //       if (!isUserExits) {
  //         const createUser = await prismaClient.user.create({
  //           data: {
  //             name: profile?.name ?? ((profile as any)?.display_name as string),
  //             provider: account?.provider as CredentialType,
  //             email: profile?.email as string,
  //             image:
  //               account?.provider === "google"
  //                 ? (profile as any)?.picture
  //                 : (profile as any)?.images[0]?.url,
  //           },
  //         });
  //         if (!createUser) {
  //           return `/sign-in?error=error_to_create_account`;
  //         }
  //         if (createUser) {
  //           return true;
  //         }
  //       }
  //       return true;
  //     } catch (error) {
  //       return `/sign-in?error=something-went-wrong&message=${error}`;
  //     }
  //   },
  // },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  debug: process.env.NODE_ENV === "development",
};
