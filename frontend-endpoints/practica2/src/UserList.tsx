import { useEffect, useState } from "react";

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
  }, [token]);

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

  return (
    <div className="panel">
      <h2>Usuarios</h2>

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
