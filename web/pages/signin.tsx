import { SignIn } from "@clerk/nextjs";

export default function Signup() {
  return (
    <div className="h-screen w-screen flex items-center justify-center align-center">
      <SignIn redirectUrl="/home" />
    </div>
  );
}
