import { ChangeEvent, FC, useState } from "react";
import { PedidoInfo, Pedidos, fullData } from "../data";
import ApiSearchDropdown from "./api-search-dropdown";
import OrderPreselect from "./order-preselect";

import { db } from "../db";
import { DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";

interface DateTypes {
  date?: string;
}

const SelectMenu: FC<DateTypes> = ({ date }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const [foodFiltered, setFoodFiltered] = useState<typeof fullData>([]);
  const [cantidad, setCantidad] = useState<number>(1);
  const [currentPed, setCurrentPed] = useState<Pedidos>({
    name: "",
    pedido: [],
    total: { sumDolar: 0, sumBs: 0 },
    pagado: false,
  });
  const [pedidoList, setPedidoList] = useState<PedidoInfo[]>([]);
  const [pedidoItem, setPedido] = useState<PedidoInfo>({
    cantidad: 1,
    item: "",
    precio: { dolar: 0, bolivar: 0 },
  });

  console.log(pedidoItem);

  const sumDolar = pedidoList.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.precio.dolar * currentValue.cantidad,
    0
  );
  const sumBs = pedidoList.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.precio.bolivar * currentValue.cantidad,
    0
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    if (e.target.name === "item") setSearchParams(query);
    if (e.target.name === "name")
      setCurrentPed((prev) => ({ ...prev, name: e.target.value }));

    if (e.target.name === "item" && query.length > 1) {
      setSearchParams(query);
      const filteredFood = fullData.filter(
        (item) => item.nombre.toLowerCase().indexOf(query) > -1
      );
      setFoodFiltered(filteredFood);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handlePedido = async () => {
    if (currentPed.name === "")
      return alert("El nombre del cliente esta vacio");
    if (pedidoList.length < 1) return alert("No has elegido ninguna comida");

    setCurrentPed((prev) => ({
      ...prev,
      pedido: pedidoList,
    }));

    try {
      const parseListPed = pedidoList.map((pedido) => {
        return `${pedido.item},,${JSON.stringify(pedido.precio)},,${
          pedido.cantidad
        }`;
      });
      await db.pedidos.add({
        ...currentPed,
        pedido: parseListPed,
        total: [sumDolar, sumBs],
        refs: [],
        fecha: date!,
      });

      setPedidoList([]);
      setPedido((prev) => ({
        ...prev,
        item: "",
        cantidad: 1,
      }));
      setCantidad(1);
      setSearchParams("");

      setCurrentPed({
        name: "",
        pedido: [],
        total: { sumDolar: 0, sumBs: 0 },
        pagado: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(currentPed);

  return (
    <div className="h-screen flex flex-col justify-center scrollbar-hide overflow-y-scroll">
      <DialogClose asChild>
        <Button type="button" className="" variant="outline">
          Cerrar Gestor
        </Button>
      </DialogClose>
      <input
        className="p-5 border my-2 border-blue-300 rounded-md"
        type="text"
        name="name"
        onChange={handleChange}
        placeholder="Nombre"
      />
      <div className="flex p-5 relative border border-blue-300 rounded-md">
        <div className="w-full">
          <div className="flex flex-col">
            <div className="">
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-2 text-lg text-[#333]">
                  <span
                    onClick={() =>
                      setCantidad((prev) => (prev === 1 ? 1 : prev - 1))
                    }
                    className="cursor-pointer flex items-center w-8 h-8 bg-gray-100 p-2 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 fill-current"
                      viewBox="0 0 124 124"
                    >
                      <path
                        d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </span>
                  <span className="mx-3">{cantidad}</span>
                  <span
                    onClick={() => setCantidad((prev) => prev + 1)}
                    className="cursor-pointer flex items-center w-8 h-8 bg-gray-100 p-2 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 fill-current"
                      viewBox="0 0 42 42"
                    >
                      <path
                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex w-full">
                <input
                  type="search"
                  value={searchParams}
                  onChange={handleChange}
                  className="p-5 my-2 border w-10/12 border-blue-300 rounded-md"
                  placeholder="Buscar..."
                  name="item"
                />
                <span
                  onClick={() => {
                    setPedido((prev) => ({
                      ...prev,
                      item: "",
                      cantidad: 1,
                    }));
                    setCantidad(1);
                    setSearchParams("");
                  }}
                  className="cursor-pointer hover:bg-gray-200 justify-center flex items-center w-2/12 bg-gray-100 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 fill-current"
                    viewBox="0 0 124 124"
                  >
                    <path
                      d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </span>
              </div>
              {showDropdown && (
                <ApiSearchDropdown
                  setFoodName={setPedido}
                  addQuery={setSearchParams}
                  foods={foodFiltered}
                  closeDrop={setShowDropdown}
                />
              )}
            </div>
          </div>
          <button
            onClick={() => {
              if (pedidoItem.item === "")
                return alert("Campo de comida esta vacio");

              const existPed = pedidoList.find(
                (ped) => ped.item === pedidoItem.item
              );

              if (existPed) {
                const foodsSelectedUpdated = pedidoList.map((ped) => {
                  if (ped.item === existPed.item) {
                    return {
                      ...ped,
                      cantidad: ped.cantidad + cantidad,
                    };
                  } else {
                    return ped;
                  }
                });
                setPedidoList(foodsSelectedUpdated);
              } else {
                setPedidoList([
                  ...pedidoList,
                  {
                    ...pedidoItem,
                    cantidad,
                  },
                ]);
              }
            }}
            className="w-full p-2 transition-all text-gray-700 duration-75 ease-out bg-green-300 hover:bg-green-500 rounded-md text-xl"
          >
            agregar
          </button>
        </div>
      </div>

      {pedidoList.length > 0 ? (
        <OrderPreselect
          handlePedido={handlePedido}
          sum={{ sumDolar, sumBs }}
          deleteFood={setPedidoList}
          pedidos={pedidoList}
        />
      ) : null}
      <DialogClose asChild>
        <Button type="button" variant="secondary" className="mt-2">
          Cerrar
        </Button>
      </DialogClose>
    </div>
  );
};

export default SelectMenu;
