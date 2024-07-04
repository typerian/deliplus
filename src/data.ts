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
  { id: 10, nombre: "hamburguesa doble", precio: { dolar: 6, bolivar: 240 } },
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
  { id: 21, nombre: "glub 1lt", precio: { dolar: 1.25, bolivar: 50 } },
  {
    id: 24,
    nombre: "4 hamburguesas especiales",
    precio: { dolar: 10, bolivar: 400 },
  },
  { id: 25, nombre: "2 shawarmas", precio: { dolar: 10, bolivar: 400 } },
  { id: 26, nombre: "2 club houses", precio: { dolar: 10, bolivar: 400 } },
];
