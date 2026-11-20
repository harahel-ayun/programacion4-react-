import { useState } from "react";
import type { FormEvent } from "react";

interface ItemCompra {
  id: number;
  texto: string;
}

export default function Ej5() {
  const [texto, setTexto] = useState("");
  const [items, setItems] = useState<ItemCompra[]>([]);

  function handleAgregar(e: FormEvent) {
    e.preventDefault();
    const limpio = texto.trim();
    if (limpio === "") return;

    const nuevo: ItemCompra = { id: Date.now(), texto: limpio };
    setItems([...items, nuevo]);
    setTexto("");
  }

  function eliminar(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <div>
      <form onSubmit={handleAgregar} className="fila-controles">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej: yerba"
        />
        <button type="submit">Agregar</button>
      </form>

      {items.length === 0 ? (
        <p className="mensaje-aux">No hay nada para comprar</p>
      ) : (
        <ul className="lista">
          {items.map((item) => (
            <li key={item.id}>
              <div className="item-compra">
                <span>{item.texto}</span>
                <button type="button" onClick={() => eliminar(item.id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
