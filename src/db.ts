// db.ts
import Dexie, { Table } from "dexie";
import { PedidosDB } from "./data";

export class MySubClassedDexie extends Dexie {
  // 'pedidos' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  pedidos!: Table<PedidosDB>;

  constructor() {
    super("delicrunch");
    this.version(1).stores({
      pedidos: "++id, name, *pedido, *total, pagado, fecha, *refs", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
