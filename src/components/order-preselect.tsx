import { FC } from "react";
import { PedidoInfo } from "../data";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface PedidoEntries {
  pedidos: PedidoInfo[];
  deleteFood: React.Dispatch<React.SetStateAction<PedidoInfo[]>>;
  sum: { sumDolar: number; sumBs: number };
  handlePedido: () => Promise<void>;
}

const OrderPreselect: FC<PedidoEntries> = ({
  pedidos,
  deleteFood,
  sum,
  handlePedido,
}) => {
  return (
    <div className="w-full max-w-xl bg-white shadow-lg ml-auto">
      <div className="overflow-y-auto p-6 h-[150px] divide-y mt-2">
        {pedidos.map((ped) => (
          <div
            key={`${ped.item} - ${ped.cantidad}`}
            className="flex items-center justify-between gap-4 py-8"
          >
            <div className="flex max-sm:flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-md font-bold text-[#333]">
                    {ped.cantidad} - {ped.item} -{" "}
                    <span className="font-bold text-emerald-700">
                      ${ped.precio.dolar * ped.cantidad}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 fill-red-500 inline cursor-pointer"
              viewBox="0 0 24 24"
              onClick={() =>
                deleteFood((prev) =>
                  prev.filter((food) => food.item !== ped.item)
                )
              }
            >
              <path
                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                data-original="#000000"
              ></path>
              <path
                d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                data-original="#000000"
              ></path>
            </svg>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col border-t bg-white">
        <ul className="text-[#333] divide-y">
          <li className="flex flex-wrap gap-4 text-md font-bold">
            Subtotal{" "}
            <span className="ml-auto">
              ${`${sum.sumDolar} - ${sum.sumBs} Bs`}
            </span>
          </li>
        </ul>
        <Button
          onClick={async () => {
            await handlePedido();
            toast.success("Orden agregada");
          }}
          variant="default"
          type="button"
          className="my-2"
        >
          Agregar pedido
        </Button>
      </div>
    </div>
  );
};

export default OrderPreselect;
