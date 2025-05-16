"use server";
import { IUserDetails } from "@/models/user.model";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jwt from "jsonwebtoken";

export interface Errors {
  userName?: string;
  password?: string;
  message?: string;
  success?: boolean;
}

type jwtTokenType = {
  id: number;
  userName: string;
  fullName: string;
  role: string;
};
const SECRET_KEY: jwt.Secret = process.env.NEXT_PUBLIC_SECRET_KEY || "";

export async function validateUser(_initialState: unknown, formData: FormData) {
  const userName = formData.get("userName")?.toString();
  const password = formData.get("password")?.toString();

  const errors: Errors = {};

  if (!userName?.trim()) {
    errors.userName =
      "User name is required field, please enter valid user name.";
  }

  if (!password?.trim()) {
    errors.password =
      "Password is required field, please enter a valid password.";
  }
  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }
  const values = {
    user_Name: userName,
    uPassword: password,
  };

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL + "api/validateuser",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );
  if (response.ok) {
    const respData = (await response.json()) as IUserDetails;
    if (respData) {
      const tokenData: jwtTokenType = {
        id: respData.user_Id,
        userName: respData.user_Name,
        fullName: `${respData.firstName} ${respData.lastName}`,
        role: respData.uRole,
      };
      const token = jwt.sign(tokenData, SECRET_KEY, {
        expiresIn: "1d",
      });
      const getCoookie = cookies();
      (await getCoookie).set("token", token);
      redirect("/dashboard");
    } else {
      errors.message = "Not a valid User, Please check credentails entered!";
      errors.success = false;
      if (Object.keys(errors).length > 0) {
        return {
          errors,
        };
      }
    }
  }
}

export async function getLoggedInUserDetails() {
  const getCookies = cookies();
  const token = (await getCookies).get("token")?.value;
  if (token) {
    const decodedToken = jwt.verify(token, SECRET_KEY) as jwtTokenType; //jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY);
    return decodedToken;
  } else {
    redirect("/");
  }
}
