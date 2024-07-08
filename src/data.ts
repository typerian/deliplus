export interface PedidoInfo {
  item: string;
  cantidad: number;
  precio: { dolar: number; bolivar: number };
}

export interface Pedidos {
  id?: number;
  name: string;
  pedido: PedidoInfo[];
  total: { sumDolar: number; sumBs: number };
  pagado: boolean;
  refs?: string[];
  fecha?: string;
}

export interface PedidosDB {
  id?: number;
  name: string;
  pedido: string[];
  total: number[];
  pagado: boolean;
  refs: string[];
  fecha: string;
}

export const parsePedido = (pedido: string) => {
  const [item, precio, cantidad] = pedido.split(",,");
  return {
    item,
    precio: JSON.parse(precio) as { dolar: number; bolivar: number },
    cantidad: Number(cantidad),
  };
};

export const fullData = [
  { id: 1, nombre: "club house", precio: { dolar: 6, bolivar: 280 } },
  { id: 3, nombre: "pepito 20cm", precio: { dolar: 6, bolivar: 240 } },
  { id: 4, nombre: "shawarma", precio: { dolar: 6, bolivar: 240 } },
  {
    id: 5,
    nombre: "combo pepiperro normal x2",
    precio: { dolar: 3.5, bolivar: 140 },
  },
  {
    id: 6,
    nombre: "combo pepiperro especial x2",
    precio: { dolar: 4.5, bolivar: 180 },
  },
  {
    id: 7,
    nombre: "hamburguesa clasica carne",
    precio: { dolar: 2, bolivar: 85 },
  },
  {
    id: 8,
    nombre: "hamburguesa especial carne",
    precio: { dolar: 3, bolivar: 125 },
  },
  {
    id: 9,
    nombre: "hamburguesa super especial carne",
    precio: { dolar: 4, bolivar: 160 },
  },
  { id: 10, nombre: "hamburguesa mixta", precio: { dolar: 7, bolivar: 280 } },
  { id: 40, nombre: "hamburguesa doble", precio: { dolar: 6, bolivar: 240 } },
  {
    id: 11,
    nombre: "hamburguesa clasica pollo",
    precio: { dolar: 3, bolivar: 125 },
  },
  {
    id: 12,
    nombre: "hamburguesa especial pollo",
    precio: { dolar: 4, bolivar: 160 },
  },
  {
    id: 13,
    nombre: "hamburguesa super especial pollo",
    precio: { dolar: 5, bolivar: 200 },
  },
  { id: 14, nombre: "perro", precio: { dolar: 1, bolivar: 50 } },
  { id: 15, nombre: "perro especial", precio: { dolar: 1.5, bolivar: 65 } },
  { id: 16, nombre: "combo perro x2", precio: { dolar: 2, bolivar: 85 } },
  {
    id: 17,
    nombre: "combo perro especial x2",
    precio: { dolar: 3, bolivar: 125 },
  },
  { id: 18, nombre: "racion papas", precio: { dolar: 4, bolivar: 160 } },
  { id: 19, nombre: "1/2 racion papas", precio: { dolar: 2.5, bolivar: 100 } },
  { id: 20, nombre: "salchipapas", precio: { dolar: 4, bolivar: 160 } },
  { id: 21, nombre: "refresco", precio: { dolar: 1.25, bolivar: 50 } },
  { id: 26, nombre: "pollo a la canasta", precio: { dolar: 6, bolivar: 240 } },
  { id: 27, nombre: "cesar crunch", precio: { dolar: 6, bolivar: 240 } },
  { id: 28, nombre: "ensalada cesar", precio: { dolar: 3.5, bolivar: 140 } },
  {
    id: 28,
    nombre: "ensalada cesar con pollo",
    precio: { dolar: 4.5, bolivar: 140 },
  },
  {
    id: 29,
    nombre: "2 club houses (combo 4)",
    precio: { dolar: 10, bolivar: 410 },
  },
  {
    id: 30,
    nombre: "2 shawarmas (combo 2)",
    precio: { dolar: 10, bolivar: 410 },
  },
  {
    id: 31,
    nombre: "4 hamburguesas especiales carne (combo 1)",
    precio: { dolar: 10, bolivar: 410 },
  },
  {
    id: 32,
    nombre: "2 hamburguesas mixtas (combo 3)",
    precio: { dolar: 10, bolivar: 410 },
  },
  {
    id: 33,
    nombre: "3 hamburguesas pollo crispy especial (combo 5)",
    precio: { dolar: 10, bolivar: 410 },
  },
  {
    id: 34,
    nombre: "2 pepitos + refresco (combo 6)",
    precio: { dolar: 12, bolivar: 492 },
  },
  {
    id: 35,
    nombre: "2 cesar crunch (combo 7)",
    precio: { dolar: 10, bolivar: 410 },
  },
  {
    id: 36,
    nombre: "2 hamburguesas crispy especiales + papas fritas (combo 8)",
    precio: { dolar: 10, bolivar: 410 },
  },
  {
    id: 37,
    nombre: "pepi cesar",
    precio: { dolar: 7.5, bolivar: 308 },
  },
  {
    id: 38,
    nombre: "shawarma crispy",
    precio: { dolar: 7.5, bolivar: 308 },
  },
  {
    id: 39,
    nombre: "club house cesar",
    precio: { dolar: 7.5, bolivar: 308 },
  },
];
