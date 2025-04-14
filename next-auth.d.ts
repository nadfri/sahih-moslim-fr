import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role: Role;
      // Include other default properties by extending DefaultSession["user"]
    } & DefaultSession["user"]; // Keep the default properties like name, email, image, id
  }

  // If you are extending the User model returned by the adapter, you can do it here too.
  // interface User {
  //   role: Role;
  // }
}

// Also extend the JWT type if you need to access the role directly from the token type elsewhere
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** User role */
    role?: Role; // Use optional '?' if the role might not always be present initially
  }
}
