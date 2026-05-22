import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function middleware(
  request: NextRequest
) {

  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(

      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {

          get(name: string) {

            return request.cookies.get(
              name
            )?.value;

          },

          set(
            name: string,
            value: string,
            options: any
          ) {

            response.cookies.set({
              name,
              value,
              ...options,
            });

          },

          remove(
            name: string,
            options: any
          ) {

            response.cookies.set({
              name,
              value: "",
              ...options,
            });

          },

        },

      }

    );

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  const protectedRoutes = [
    "/dashboard",
    "/leads",
    "/pipeline",
  ];

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        request.nextUrl.pathname.startsWith(
          route
        )
    );

  const isAuthPage =
    request.nextUrl.pathname ===
      "/login" ||
    request.nextUrl.pathname ===
      "/signup";

  if (
    !session &&
    isProtectedRoute
  ) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );

  }

  if (
    session &&
    isAuthPage
  ) {

    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );

  }

  return response;

}

export const config = {

  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/pipeline/:path*",
    "/login",
    "/signup",
  ],

};