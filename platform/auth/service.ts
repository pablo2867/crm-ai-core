import {
  createClient,
} from "@/lib/supabase-server";

import type {
  LoginRequest,
  SignupRequest,
} from "./types";

export class AuthService {

  /*
  ---------------------------------------
  Registro
  ---------------------------------------
  */

  async signup(
    request: SignupRequest,
  ) {

    const supabase =
      await createClient();

    return supabase.auth.signUp({

      email:
        request.email,

      password:
        request.password,

      options: {

        data: {

          full_name:
            request.fullName,

        },

      },

    });

  }

  /*
  ---------------------------------------
  Login
  ---------------------------------------
  */

  async login(
    request: LoginRequest,
  ) {

    const supabase =
      await createClient();

    return supabase.auth.signInWithPassword({

      email:
        request.email,

      password:
        request.password,

    });

  }

  /*
  ---------------------------------------
  Logout
  ---------------------------------------
  */

  async logout() {

    const supabase =
      await createClient();

    return supabase.auth.signOut();

  }

  /*
  ---------------------------------------
  Usuario actual
  ---------------------------------------
  */

  async getUser() {

    const supabase =
      await createClient();

    return supabase.auth.getUser();

  }

  /*
  ---------------------------------------
  Sesión actual
  ---------------------------------------
  */

  async getSession() {

    const supabase =
      await createClient();

    return supabase.auth.getSession();

  }

}

export const authService =
  new AuthService();