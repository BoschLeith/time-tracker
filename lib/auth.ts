import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

type UserPayload = {
  id: number;
  email: string;
};

const JWT_SECRET = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function encrypt(payload: UserPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as UserPayload;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(errorMessage);
  }
}

export async function getCurrentUserId(): Promise<number> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    throw new Error("No session token found");
  }

  const userPayload = await decrypt(token);

  if (userPayload) {
    return userPayload.id;
  } else {
    throw new Error("Invalid session token or expired token");
  }
}
