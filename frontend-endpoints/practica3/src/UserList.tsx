import { useEffect, useState } from "react";
import type { FormEvent } from "react";

interface User {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  age: number;
  country: Country | null;
  roles: Role[];
}

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [search, setSearch] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          setError(data.detail || "Error al cargar usuarios");
          return;
        }
        setUsers(data);
      })
      .catch(() => {
        setError("No se pudo conectar con la API");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, reloadCount]);

  useEffect(() => {
    if (selectedId === null) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          setError(data.detail || "Error al cargar el detalle");
          return;
        }
        setSelectedUser(data);
      })
      .catch(() => {
        setError("No se pudo conectar con la API");
      });
  }, [selectedId, token]);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/search/${encodeURIComponent(term)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Error al buscar usuarios");
        return;
      }
      setUsers(data);
    } catch {
      setError("No se pudo conectar con la API");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setSearch("");
    setReloadCount((n) => n + 1);
  }

  return (
    <div className="panel">
      <h2>Usuarios</h2>

      <form onSubmit={handleSearch} className="barra-acciones">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button type="button" className="secundario" onClick={handleClear}>
          Limpiar
        </button>
      </form>

      {loading ? (
        <p className="cargando">Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="lista-usuarios">
          {users.map((user) => (
            <li
              key={user.id}
              className={`item-usuario ${selectedId === user.id ? "seleccionado" : ""}`}
            >
              <span
                className="nombre-usuario"
                onClick={() => setSelectedId(user.id)}
              >
                {user.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      {selectedUser && (
        <div className="detalle">
          <h3>Detalle de {selectedUser.name}</h3>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Edad:</strong> {selectedUser.age}
          </p>
          <p>
            <strong>País:</strong>{" "}
            {selectedUser.country ? selectedUser.country.name : "Sin país"}
          </p>
          <p>
            <strong>Roles:</strong>{" "}
            {selectedUser.roles.length > 0
              ? selectedUser.roles.map((r) => r.name).join(", ")
              : "Sin roles"}
          </p>
        </div>
      )}
    </div>
  );
}
