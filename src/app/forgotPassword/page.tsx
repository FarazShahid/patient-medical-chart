import { Suspense } from "react";
import ForgotPasswordEmail from "../componenet/forgotPasswordEmailcomponenet";
import PublicLayout from "../layout";

export default function ForgotPasswordEmailPage() {
  return (
    <PublicLayout>
      <Suspense>
        <ForgotPasswordEmail />
      </Suspense>
    </PublicLayout>
  );
}
