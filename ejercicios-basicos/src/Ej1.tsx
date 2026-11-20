interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
}

function Producto({ nombre, precio, stock }: ProductoProps) {
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      <p>${precio}</p>
      <p className={stock === 0 ? "sin-stock" : undefined}>
        {stock === 0 ? "Sin stock" : `Stock: ${stock} unidades`}
      </p>
    </div>
  );
}

export default function Ej1() {
  return (
    <div className="tarjetas">
      <Producto nombre="Teclado" precio={45000} stock={12} />
      <Producto nombre="Mouse" precio={18000} stock={0} />
      <Producto nombre="Monitor" precio={320000} stock={3} />
    </div>
  );
}
