import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { userIsStaffRole } from "@/lib/auth/app-role";
import {
  adminEventsPath,
  loginPath,
  staffEventsPath,
  staffSignUpPath,
} from "@/lib/routes";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

function isAuthPagePath(path: string): boolean {
  return (
    path === loginPath() ||
    path === staffSignUpPath() ||
    path.startsWith("/signup/")
  );
}

function redirectToLogin(request: NextRequest, withNextPath?: string): NextResponse {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = loginPath();
  redirectUrl.search = "";
  if (withNextPath) {
    redirectUrl.searchParams.set("next", withNextPath);
  }
  return NextResponse.redirect(redirectUrl);
}

/**
 * Refresh da sessão Supabase + controle de acesso.
 * Sem env público do Supabase: rotas sensíveis fecham (fail-closed), exceto /login e /signup/*.
 * Rotas /display não passam por getUser() aqui (evita 429 em TVs com auto-refresh).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const nextParam = `${path}${request.nextUrl.search}`;

  const isDisplayPublic = path.startsWith("/display");
  const onAuthPage = isAuthPagePath(path);

  /** TVs /display fazem refresh frequente; getUser() bate no Auth e estoura 429. */
  if (isDisplayPublic) {
    return NextResponse.next({ request });
  }

  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabaseEnv) {
    if (onAuthPage) {
      return NextResponse.next({ request });
    }
    if (path === "/" || path.startsWith("/admin") || path.startsWith("/staff")) {
      const next =
        path === "/" ? undefined : nextParam;
      return redirectToLogin(request, next);
    }
    return NextResponse.next({ request });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as never),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (onAuthPage) {
    return response;
  }

  if (path === "/") {
    if (!user) {
      return redirectToLogin(request);
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.search = "";
    redirectUrl.pathname = userIsStaffRole(user)
      ? staffEventsPath()
      : adminEventsPath();
    return NextResponse.redirect(redirectUrl);
  }

  if (path.startsWith("/admin")) {
    if (!user) {
      return redirectToLogin(request, nextParam);
    }
    if (userIsStaffRole(user)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = staffEventsPath();
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (path.startsWith("/staff")) {
    if (!user) {
      return redirectToLogin(request, nextParam);
    }
  }

  return response;
}
