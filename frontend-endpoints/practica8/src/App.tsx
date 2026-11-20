import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { UserList } from "./UserList";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  roles: Role[];
}

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [me, setMe] = useState<User | null>(null);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setMe(null);
    setError("Tu sesión venció");
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/me/id`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (resId) => {
        if (resId.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!resId.ok) return;
        const { id } = await resId.json();

        const resUser = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (resUser.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!resUser.ok) return;
        const userData: User = await resUser.json();
        setMe(userData);
      })
      .catch(() => {});
  }, [token, handleUnauthorized]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Error al iniciar sesión");
        return;
      }
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setEmail("");
      setPassword("");
    } catch {
      setError("No se pudo conectar con la API");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setMe(null);
    setError(null);
  }

  if (token) {
    const rolesTexto = me ? me.roles.map((r) => r.name).join(", ") : "";
    return (
      <div className="contenedor">
        <header className="topbar">
          <p className="saludo">
            {me
              ? `Hola, ${me.name}${rolesTexto ? ` (${rolesTexto})` : ""}`
              : "Hola"}
          </p>
          <button type="button" className="secundario" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </header>
        <UserList token={token} onUnauthorized={handleUnauthorized} />
      </div>
    );
  }

  return (
    <div className="login-card">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="formulario">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
