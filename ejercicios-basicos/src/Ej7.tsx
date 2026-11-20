interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
  oferta?: boolean;
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      {oferta && <p className="oferta">¡Oferta!</p>}
      <p>${precio}</p>
      <p className={stock === 0 ? "sin-stock" : undefined}>
        {stock === 0 ? "Sin stock" : `Stock: ${stock}`}
      </p>
    </div>
  );
}

export default function Ej7() {
  return (
    <div className="tarjetas">
      <Producto nombre="Teclado" precio={45000} stock={12} oferta />
      <Producto nombre="Mouse" precio={18000} stock={0} />
    </div>
  );
}
