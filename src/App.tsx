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

interface Monitor {
  title: string; // The name of the monitor (e.g., "Amazon Gift Card")
  change: number; // The change in price (e.g., 0.05)
  color: string; // The color associated with the change (e.g., "red")
  image: string; // URL of the monitor's image
  last_update: string; // The last update time in a specified format (e.g., "12/08/2024, 01:04 PM")
  percent: number; // Percentage change (e.g., 0.14)
  price: number; // Current price (e.g., 35.55)
  price_old: number; // Previous price (e.g., 35604730)
  symbol: string; // Symbol (e.g., "▼")
}

interface RootObject {
  datetime: Date; // Information about the date and time
  monitors: { [key: string]: Monitor }; // An object containing monitors with their names as keys
}

function App() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [dolar, setDolar] = React.useState<"paralelo" | "bcv">("paralelo");
  const [monitor, setMonitor] = React.useState<RootObject | null>(null);
  const [bolivar, setBolivar] = React.useState<number | undefined>(undefined);
  const [conv, setConv] = React.useState<number>(1);

  //fetching de todos los pedidos en funcion de la fecha en el calendario
  const pedidos = useLiveQuery(
    async () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      await db.pedidos.where("fecha").equals(date?.toDateString()!).toArray(),
    [date]
  );

  const circumference = (r: string) => {
    if (dolar === "paralelo" && monitor?.monitors.enparalelovzla) {
      return parseFloat(r) * monitor.monitors.enparalelovzla.price;
    } else if (dolar === "bcv" && monitor?.monitors.bcv) {
      return parseFloat(r) * monitor.monitors.bcv.price;
    }
  };

  useEffect(() => {
    fetch(
      "https://pydolarvenezuela-api.vercel.app/api/v1/dollar?conversion=usd"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMonitor(data);
        console.log(data);
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
          {monitor !== null && (
            <div className="flex justify-center bg-gray-700 p-4 rounded-3xl m-2 w-52 text-white">
              <div className="">
                <div>
                  <select
                    value={dolar} // ...force the select's value to match the state variable...
                    onChange={(e) => {
                      setDolar((e.target.value as "paralelo") || "bcv");
                      if (dolar === "bcv") {
                        setConv(1);
                        setBolivar(monitor.monitors.enparalelovzla.price);
                      } else {
                        setConv(1);

                        setBolivar(monitor.monitors.bcv.price);
                      }
                    }}
                    name="select"
                    defaultValue={"paralelo"}
                    className="rounded-full p-2 w-40 text-center bg-green-500 font-bold text-black"
                  >
                    <option value="bcv">BCV</option>
                    <option value="paralelo">Paralelo</option>
                  </select>
                </div>
                <div className="mt-2 flex font-semibold justify-between border-b-2 border-green-700">
                  <div>$</div>
                  <input
                    type="tel"
                    className="bg-transparent w-16 text-right"
                    defaultValue={conv}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        const parseValue = circumference("1");
                        setBolivar(parseValue!);
                      } else {
                        const parseValue = circumference(e.target.value);
                        setBolivar(parseValue!);
                      }
                    }}
                  />
                </div>
                <div className="flex font-semibold justify-between border-b-2 border-green-700">
                  <div>Bs</div>
                  <input
                    type="tel"
                    className="bg-transparent w-16 text-right"
                    value={bolivar}
                  />
                </div>
              </div>
            </div>
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
