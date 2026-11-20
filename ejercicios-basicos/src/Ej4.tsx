import { useState } from "react";

export default function Ej4() {
  const [celsius, setCelsius] = useState("");

  const c = Number(celsius);
  const esNumeroValido = celsius.trim() !== "" && !Number.isNaN(c);
  const fahrenheit = (c * 9) / 5 + 32;

  return (
    <div>
      <input
        type="number"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
        placeholder="Grados Celsius"
      />
      {esNumeroValido && (
        <div style={{ marginTop: 12 }}>
          <p className="valor-grande">{fahrenheit.toFixed(1)} °F</p>
          {c > 30 && <p className="mensaje-aux">Hace calor</p>}
        </div>
      )}
    </div>
  );
}
