// middleware.js

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("authToken");
  console.log(token);
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Example secret key (replace with your generated key)
    const secretKey = "GENERATED_SECRET_KEY_HERE";

    // Encoding the secret key using TextEncoder
    const secret = new TextEncoder().encode(secretKey);
    await jwtVerify(token.value, secret, { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/admin", "/dashboard"],
};
