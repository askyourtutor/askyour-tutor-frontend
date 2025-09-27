// Auth.js inspired configuration
// This follows the actual Auth.js patterns from the core documentation

export interface AuthConfig {
  providers: Provider[];
  secret: string;
  basePath?: string;
  trustHost?: boolean;
  session?: {
    strategy: 'jwt' | 'database';
    maxAge: number;
  };
  callbacks?: {
    jwt?: (params: JWTCallbackParams) => Promise<JWT | null>;
    session?: (params: SessionCallbackParams) => Promise<Session>;
    signIn?: (params: SignInCallbackParams) => Promise<boolean>;
    redirect?: (params: RedirectCallbackParams) => Promise<string>;
  };
  pages?: {
    signIn?: string;
    signOut?: string;
    error?: string;
  };
}

export interface Provider {
  id: string;
  name: string;
  type: 'oauth' | 'credentials' | 'email';
  clientId?: string;
  clientSecret?: string;
  authorize?: (credentials: Record<string, unknown>) => Promise<User | null>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface JWT {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
  iat?: number;
  exp?: number;
  jti?: string;
  accessToken?: string;
}

export interface Session {
  user: User;
  expires: string;
}

export interface Account {
  provider: string;
  access_token?: string;
  [key: string]: unknown;
}

export interface JWTCallbackParams {
  token: JWT;
  user?: User;
  account?: Account;
  profile?: Record<string, unknown>;
  trigger?: 'signIn' | 'signUp' | 'update';
}

export interface SessionCallbackParams {
  session: Session;
  token: JWT;
}

export interface SignInCallbackParams {
  user: User;
  account?: Account;
  profile?: Record<string, unknown>;
}

export interface RedirectCallbackParams {
  url: string;
  baseUrl: string;
}

// Credentials Provider (like Auth.js)
export const CredentialsProvider = (options: {
  id: string;
  name: string;
  credentials: Record<string, unknown>;
  authorize: (credentials: Record<string, unknown>) => Promise<User | null>;
}): Provider => ({
  id: options.id,
  name: options.name,
  type: 'credentials',
  authorize: options.authorize,
});

// Google Provider (like Auth.js)
export const GoogleProvider = (options: {
  clientId: string;
  clientSecret: string;
}): Provider => ({
  id: 'google',
  name: 'Google',
  type: 'oauth',
  clientId: options.clientId,
  clientSecret: options.clientSecret,
});

// Facebook Provider (like Auth.js)
export const FacebookProvider = (options: {
  clientId: string;
  clientSecret: string;
}): Provider => ({
  id: 'facebook',
  name: 'Facebook',
  type: 'oauth',
  clientId: options.clientId,
  clientSecret: options.clientSecret,
});

// Auth Configuration (following Auth.js patterns)
export const authConfig: AuthConfig = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // In a real app, this would validate against your database
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (response.ok) {
            const user = await response.json();
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: import.meta.env.VITE_FACEBOOK_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  secret: import.meta.env.VITE_AUTH_SECRET || 'your-secret-key',
  basePath: '/api/auth',
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.name) {
        session.user.name = token.name;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Control whether a user is allowed to sign in
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        return true; // Allow OAuth sign-ins
      }
      if (account?.provider === 'credentials') {
        return !!user; // Allow if user exists
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
};

export default authConfig;
