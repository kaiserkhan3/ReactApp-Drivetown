"use client";
import { useUserData } from "@/hooks/useUserData";
import drivetownLogo from "@/public/drivetown.webp";
import { loginSchema } from "@/Schemas";
import { useFormik, FormikHelpers } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type loginType = {
  userName: string;
  password: string;
};

const initialValues: loginType = {
  userName: "",
  password: "",
};

export function Login() {
  const { userId } = useUserData();
  console.log("userId", userId);
  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<loginType>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, actions) => onSubmit(values, actions),
  });

  const router = useRouter();
  useEffect(() => {
    if (userId) {
      router.push("/inventory-management");
    }
  }, [userId]);
  const onSubmit = async (
    values: loginType,
    formikHelpers: FormikHelpers<loginType>
  ) => {
    const response = await signIn("credentials", {
      userName: values.userName,
      password: values.password,
      redirect: false,
    });

    if (response?.ok) {
      router.push("/inventory-management");
    }
  };

  return (
    <div
      className="d-flex  justify-content-center align-items-center"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#378072",
      }}
    >
      <form action="" onSubmit={handleSubmit}>
        <div
          className="d-flex flex-column rounded p-5 shadow-lg"
          style={{ backgroundColor: "hsl(0, 0%, 94%)" }}
        >
          <div
            className="p-1 mb-3  "
            style={{
              backgroundColor: "hsl(0, 0%, 94%)",
              backgroundImage: `url(${drivetownLogo.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              width: "19.8rem",
              height: "3rem",
            }}
          ></div>
          <div className="mb-3">
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              name="userName"
              onChange={handleChange}
            />
            {errors?.userName && touched.userName && (
              <p className="text-danger">{errors.userName}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange={handleChange}
            />
            {errors?.password && touched.password && (
              <p className="text-danger">{errors.password}</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-hover">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
