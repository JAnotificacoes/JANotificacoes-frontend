import { redirect } from "next/navigation";

export default function Home() {
  {/* Redireciona para /dashboard por padrão pelo lado do servidor 
    (antes do HTML renderizar) */}
    redirect("/dashboard");
}