"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    try {
      await login(email, password);
      router.push("/")
    } catch {
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <main>
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">
          Iniciar sesión
        </button>
      </form>
    </main>
  );
}