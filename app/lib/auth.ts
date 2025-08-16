import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


type UserPayload = {
  id:string;
  email: string;
};

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies(); // jeśli cookies() zwraca Promise
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

 try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Upewnij się, że to jest JwtPayload i zawiera `email`
   if (
  typeof decoded === "object" &&
  "id" in decoded &&
  "email" in decoded
) {
  return decoded as UserPayload;
}


    return null;
  } catch (err) {
    return null;
  }
}

