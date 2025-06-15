import { Suspense } from "react";
import ForgotPasswordEmail from "../componenet/forgotPasswordEmailcomponenet";

export default function ForgotPasswordEmailPage() {
  return (
    <>
      <Suspense>
        <ForgotPasswordEmail />
      </Suspense>
    </>
  );
}
