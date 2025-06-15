import { Suspense } from "react";
import ResetPassword from "../componenet/ResetPasswordForm";

export default function Home() {
  return (
      <Suspense >
        <ResetPassword />
      </Suspense>
  );
}
