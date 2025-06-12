"use client";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "@nextui-org/react";

function ForgotPasswordEmail() {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);

  const handleSubmit = async (values: FormikValues) => {
    setIsloading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );
      const result = await response.json();
      if (!response.ok && response.status !== 500) {
        toast.error(result?.message || "Action failed!");
        return;
      }
      if (response.ok) {
        router.push(`/forgetPassword?email=${values.email}`);
        toast.success(result?.message || "Action successful!");
        return;
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Action failed!");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-8  bg-white rounded-lg shadow">

    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()     
        .transform((val) => val?.trim())
          .max(50, "Email must be at most 50 characters")
          .matches(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              "Invalid Email format"
            )
          .required("Email is required"),
      })}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          {/* <div className="flex flex-col items-center w-[450px] bg-gradient-to-r from-[#E5E5E5] to-[#BEBEBE] rounded-[10px] py-8"> */}
            <div className="flex flex-col justify-center items-center gap-[25px] w-full">
              <div className="w-full h-[40px]">
                <Field
                  type="text"
                  name="email"
                  className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-[12px] flex justify-center"
                />
              </div>
              <Button
                isLoading={isLoading}
                type="submit"
                className="bg-gradient-to-r from-[#A9DFFF] via-[#72C7FA] to-[#3397D3] text-white h-[35px] w-[150px] rounded-[5px]"
              >
                Reset Password
              </Button>
            </div>
          {/* </div> */}
        </Form>
      )}
    </Formik>
    </div>
    </div>
  );
}

export default ForgotPasswordEmail;
