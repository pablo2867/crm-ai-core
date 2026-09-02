import { createServerClient } from "@supabase/ssr";
import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function proxy(
  request: NextRequest
) {
  const start = Date.now();
  const response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options
                );
              }
            );
          },
        },
      }
    );

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  const user =
    session?.user;

  console.log(
    "PROXY TIME:",
    Date.now() - start,
    "ms"
  );

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
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  if (
    !user &&
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
    user &&
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
