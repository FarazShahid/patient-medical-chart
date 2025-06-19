"use client";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import { ForgotEmailPasswordSchema } from "../schema/forgotPasswordEmail";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { EyeClosedPassword, EyeOpenPassword } from "../../../public/svgs/svgs";
import { Button } from "@heroui/react";
import Image from "next/image";

function ResetPassword() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const type = searchParams.get("type");
  const router = useRouter();
  const [isloading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values: FormikValues) => {
    const URL =
      type === "changePasswordt"
        ? `${process.env.NEXT_PUBLIC_URL}/api/auth/resetPassword`
        : `${process.env.NEXT_PUBLIC_URL}/api/auth/resetPassword`;

    values.email = emailParam;
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: type === "reset" ? "PATCH" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          newPassword: values.newPassword,
        }),
      });
      const result = await response.json();
      if (!response?.ok && response?.status !== 500) {
        setLoading(false);
        toast.error(result.message || "Action failed!");
        return;
      }
      if (response.ok) {
        setLoading(false);
        router.push("/login");
        toast.success(result?.message || "Action successful!");
        return;
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Action failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Formik
        initialValues={{
          newPassword: "",
          confirmNewPassword: "",
        }}
        validationSchema={ForgotEmailPasswordSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="flex flex-col items-center w-[450px] bg-white rounded-[10px] py-8 gap-2.5">
              <div className="flex flex-col justify-center items-center gap-[25px] w-full mb-2">
                <div className="flex justify-center">
                  <Image
                    src="/images/MedVault.svg"
                    alt="PDF Viewer Logo"
                    width={100}
                    height={70}
                    className="object-contain cursor-pointer"
                  />
                </div>
                <div className="h-[40px] relative">
                  <label htmlFor=""></label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    className="w-full min-w-[330px] rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300/40 focus:outline-none focus:shadow-[0_0_12px_rgba(99,102,241,0.4)] hover:shadow-lg"
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    className="absolute z-50 right-0 pr-1 top-[55%] transform -translate-y-1/2 text-gray-500 foucs-outline focus:outline-none focus-within:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOpenPassword /> : <EyeClosedPassword />}
                  </button>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-[12px] flex justify-center"
                  />
                </div>

                <div className="h-[40px] relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    className="w-full min-w-[330px] rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300/40 focus:outline-none focus:shadow-[0_0_12px_rgba(99,102,241,0.4)] hover:shadow-lg"
                    placeholder="Confirm New Password"
                  />
                  <button
                    type="button"
                    className="absolute z-50 right-0 pr-1 top-[55%] transform -translate-y-1/2 text-gray-500 foucs-outline focus:outline-none focus-within:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOpenPassword />
                    ) : (
                      <EyeClosedPassword />
                    )}
                  </button>
                  <ErrorMessage
                    name="confirmNewPassword"
                    component="div"
                    className="text-red-500 text-[12px] flex justify-center"
                  />
                </div>
              </div>
              <div className="gap-2 mt-4">
                <Button
                  isLoading={isloading}
                  type="submit"
                  className={`w-full min-w-[330px] flex justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0C432E] hover:bg-[#DA9C2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isloading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Reset Password
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ResetPassword;
