import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">Tattoo App</h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Découvrez et partagez vos créations artistiques avec notre
            communauté
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/auth">Se connecter</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-3"
          >
            <Link href="/auth">S&apos;inscrire</Link>
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link href="/auth" className="text-blue-600 hover:underline">
            Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
