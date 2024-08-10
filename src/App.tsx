import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import Pedidos from "./components/pedidos";
import SelectMenu from "./components/menu-select";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { Calendar } from "./components/ui/calendar";
import { es } from "date-fns/locale";
import React, { useEffect } from "react";

interface ParaleloTypes {
  change: number;
  color: string;
  image: string;
  last_update: string;
  percent: number;
  price: number;
  price_old: string;
  symbol: string;
  title: string;
}

function App() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [paralelo, setParalelo] = React.useState<ParaleloTypes | null>(null);

  //fetching de todos los pedidos en funcion de la fecha en el calendario
  const pedidos = useLiveQuery(
    async () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      await db.pedidos.where("fecha").equals(date?.toDateString()!).toArray(),
    [date]
  );

  useEffect(() => {
    fetch(
      "https://pydolarvenezuela-api.vercel.app/api/v1/dollar?monitor=enparalelovzla"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setParalelo(data);
      });
  }, []);

  const pedidosCount = useLiveQuery(() => db.pedidos.count());

  if (!pedidos || pedidosCount === undefined) return null;

  const ordenes = pedidos.filter((item) => item.pagado === false);

  return (
    <>
      <div className="w-screen relative h-screen bg-sky-200">
        <div className="absolute w-16 h-16">
          <Dialog>
            <DialogTrigger>
              <img src="/calendary.svg" className="p-3" />
            </DialogTrigger>
            <DialogContent>
              <Calendar
                locale={es}
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </DialogContent>
          </Dialog>
          {paralelo !== null && (
            <div className="p-3 text-2xl">{paralelo?.price}</div>
          )}
        </div>
        <div className="flex flex-col md:flex-row w-full h-full justify-evenly items-center">
          <div className="relative rounded-xl text-2xl fond-bold bg-green-300">
            <div className="w-32 h-32 text-center flex items-center justify-center">
              <Dialog>
                <DialogTrigger>
                  <img src="/dinner.svg" className="p-3" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <Pedidos date={date?.toDateString()} pedidos={pedidos} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="absolute h-8 rounded-md w-8 text-center -right-3 -top-3 bg-white">
              {ordenes.length}
            </div>
          </div>
          <div className="w-32 h-32 text-center flex items-center justify-center rounded-xl text-2xl fond-bold bg-amber-400">
            <Dialog>
              <DialogTrigger>
                <img src="/invoice.svg" className="p-3" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <SelectMenu date={date?.toDateString()} />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
