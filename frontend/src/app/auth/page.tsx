import { AuthForm } from "@/components/auth/auth-form";
import Image from "next/image";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex relative">
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/auth-image.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={85}
        />
      </div>
      <div className="absolute inset-0 lg:hidden bg-black bg-opacity-50 z-10" />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 bg-white lg:bg-transparent relative z-20">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <AuthForm />
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 relative">
        <Image
          src="/auth-image.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={85}
        />
      </div>
    </div>
  );
}
