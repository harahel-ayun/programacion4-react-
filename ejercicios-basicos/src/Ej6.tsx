import { useState } from "react";

const LENGUAJES = [
  "JavaScript",
  "Java",
  "TypeScript",
  "Python",
  "C#",
  "Go",
  "Rust",
  "PHP",
];

export default function Ej6() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = LENGUAJES.filter((l) =>
    l.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar lenguaje..."
      />
      <p className="mensaje-aux">
        {filtrados.length} {filtrados.length === 1 ? "resultado" : "resultados"}
      </p>
      <ul className="lista">
        {filtrados.map((lenguaje) => (
          <li key={lenguaje}>{lenguaje}</li>
        ))}
      </ul>
    </div>
  );
}
