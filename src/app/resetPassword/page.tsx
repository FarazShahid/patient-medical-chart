import { Suspense } from "react";
import PublicLayout from "../layout";
import ResetPassword from "../componenet/ResetPasswordForm";

export default function Home() {
  return (
    <PublicLayout >
      <Suspense >
        <ResetPassword />
      </Suspense>
    </PublicLayout>
  );
}
