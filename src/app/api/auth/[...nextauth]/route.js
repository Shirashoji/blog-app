import NextAuth from "next-auth";

const handler = NextAuth({
  callbacks: {
    session({ session, token, user }) {
      return session; // The return type will match the one returned in `useSession()`
    },
  },
  authorization: {
    id: "fastapi",
    name: "FastAPI",
    type: "oauth",
    version: "2.0",
    scope: "openid profile email",

    params: { grant_type: "authorization_code" },
    accessTokenUrl: "http://localhost:8000/token",
    requestTokenUrl: "http://localhost:8000/auth/authorize",
    authorizationUrl: "http://localhost:8000/auth/authorize",
    profileUrl: "http://localhost:8000/auth/me",
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.image,
      };
    },
  },
});

export { handler as GET, handler as POST };
