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

interface ValidationErrorItem {
  loc?: (string | number)[];
  msg: string;
}

function formatErrorDetail(detail: unknown, fallback: string): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return (detail as ValidationErrorItem[])
      .map((item) => `${item.loc?.at(-1) ?? "campo"}: ${item.msg}`)
      .join(", ");
  }
  return fallback;
}

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [search, setSearch] = useState("");
  const [soloMayores, setSoloMayores] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  // Formulario de alta de usuario
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState("1");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const endpoint = soloMayores ? "/user_mayores" : "/user";
    setLoading(true);
    setError(null);
    setDeleteError(null);

    fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
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
  }, [token, soloMayores, reloadCount]);

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
    setDeleteError(null);

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
    setSoloMayores(false);
    setDeleteError(null);
    setReloadCount((n) => n + 1);
  }

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsedAge = Number(age);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          age: parsedAge,
          email,
          password,
          country_id: Number(countryId),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(formatErrorDetail(data.detail, "Error al crear usuario"));
        return;
      }

      if (!soloMayores || parsedAge >= 18) {
        setUsers((prev) => [...prev, { id: data.id, name }]);
      }
      setName("");
      setAge("");
      setEmail("");
      setPassword("");
      setCountryId("1");
    } catch {
      setFormError("No se pudo conectar con la API");
    }
  }

  async function handleDelete(user: User) {
    if (!window.confirm(`¿Seguro que querés borrar a ${user.name}?`)) return;
    setDeleteError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        setDeleteError(data.detail || "Error al borrar usuario");
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (selectedId === user.id) {
        setSelectedId(null);
        setSelectedUser(null);
      }
    } catch {
      setDeleteError("No se pudo conectar con la API");
    }
  }

  return (
    <div>
      <section className="panel">
        <h3>Alta de usuario</h3>
        <form onSubmit={handleCreateUser} className="formulario">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
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
            minLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
          >
            <option value="1">Argentina</option>
            <option value="2">Brasil</option>
          </select>
          <button type="submit">Crear usuario</button>
          {formError && <p className="error">{formError}</p>}
        </form>
      </section>

      <section className="panel">
        <h2>Usuarios {soloMayores ? "(Solo mayores)" : "(Todos)"}</h2>

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
          <button
            type="button"
            className={soloMayores ? "activo" : "secundario"}
            onClick={() => setSoloMayores((prev) => !prev)}
          >
            {soloMayores ? "Todos" : "Solo mayores"}
          </button>
        </form>

        {deleteError && <p className="error">{deleteError}</p>}

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
                <button
                  type="button"
                  className="peligro"
                  onClick={() => handleDelete(user)}
                >
                  Borrar
                </button>
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
      </section>
    </div>
  );
}
