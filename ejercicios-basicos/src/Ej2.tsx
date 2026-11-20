import { useState } from "react";

export default function Ej2() {
  const [valor, setValor] = useState(0);

  function restar() {
    if (valor > 0) {
      setValor(valor - 1);
    }
  }

  function sumar() {
    if (valor < 10) {
      setValor(valor + 1);
    }
  }

  return (
    <div>
      <p className="valor-grande">{valor}</p>
      <div className="fila-controles">
        <button type="button" onClick={restar} disabled={valor === 0}>
          -
        </button>
        <button type="button" onClick={sumar} disabled={valor === 10}>
          +
        </button>
        <button type="button" onClick={() => setValor(0)}>
          Reiniciar
        </button>
      </div>
      {valor === 10 && <p className="mensaje-aux">Llegaste al máximo</p>}
      {valor === 0 && <p className="mensaje-aux">Llegaste al mínimo</p>}
    </div>
  );
}
