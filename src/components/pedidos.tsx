import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PedidosDB, Pedidos as PedidosParsedTypes, parsePedido } from "@/data";
import { FC, useState } from "react";
import { db } from "@/db";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SelectMenuEdit from "./menu-select-edit";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface PedidosDBTypes {
  pedidos: PedidosDB[];
  date?: string;
}

const Pedidos: FC<PedidosDBTypes> = ({ pedidos }) => {
  const [keyFilt, setKeyFill] = useState<string>("por pagar");
  const [ref, setRef] = useState<string>("");

  const sumTotals = (currencyIndex: number) => {
    return pedidos.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.total[currencyIndex],
      0
    );
  };

  const sumTotalsPorPagar = (currencyIndex: number) => {
    return pedidos
      .filter((item) => item.pagado === false)
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.total[currencyIndex],
        0
      );
  };

  let ordenes: PedidosParsedTypes[] = pedidos.map((items) => {
    return {
      ...items,
      pedido: items.pedido.map(parsePedido),
      total: { sumDolar: items.total[0], sumBs: items.total[1] },
    };
  });

  switch (keyFilt) {
    case "por pagar":
      ordenes = ordenes.filter((orden) => orden.pagado === false);
      break;
    case "pagado":
      ordenes = ordenes.filter((orden) => orden.pagado === true);
      break;
    default:
      break;
  }

  const updatePagado = async (id: number, data: boolean) => {
    const prevPed = await db.pedidos.get({ id });
    if (!prevPed) return;
    await db.pedidos.update(id, {
      pagado: data,
      // eslint-disable-next-line no-unsafe-optional-chaining
      refs: [...prevPed?.refs, ref],
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copy] = useCopyToClipboard();

  const handleCopy = (orden: PedidosParsedTypes) => () => {
    let copyOrden = "";
    copyOrden += `*Pedido*:\n$`;
    orden.pedido.map((element) => {
      copyOrden += `${element.cantidad} x ${element.item} -- $${
        element.precio.dolar * element.cantidad
      }\n`;
    });

    const totalDolar = orden.pedido.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.precio.dolar * currentValue.cantidad,
      0
    );
    const totalBs = orden.pedido.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.precio.bolivar * currentValue.cantidad,
      0
    );

    copyOrden += `\n *Total*:\n$ ${totalDolar} / Bs. ${totalBs}`;
    copyOrden += `\n\n *Pago Movil*: \n Pagar 0102 04243215194 24975556 ${totalBs},00`;

    copy(copyOrden)
      .then(() => {
        console.log("Copied!", { copyOrden });
        toast.success("Copiado");
      })
      .catch((error: unknown) => {
        console.error("Failed to copy!", error);
      });
  };

  return (
    <>
      <div className="flex gap-2 justify-end">
        <button
          className={`${
            keyFilt === "por pagar" ? "bg-blue-800" : ""
          } p-3 bg-blue-500 rounded-full text-white`}
          onClick={() => setKeyFill("por pagar")}
        >
          por pagar
        </button>
        <button
          className={`${
            keyFilt === "pagado" ? "bg-blue-800" : ""
          } p-3 bg-blue-500 rounded-full text-white`}
          onClick={() => setKeyFill("pagado")}
        >
          pagado
        </button>
      </div>

      <div className="h-[80%] max-h-80 overflow-y-scroll scrollbar-hide">
        {ordenes && ordenes.length > 0 ? (
          ordenes.map((orden) => (
            <Accordion
              key={orden.id}
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value={`item-${orden.id}`}>
                <AccordionTrigger>{orden.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="mx-auto max-w-5xl">
                    <div className="grid gap-8 max-sm:mx-auto max-sm:max-w-sm grid-cols-1">
                      <div className="rounded-md border p-6">
                        <input type="hidden" name="custom" value={orden.name} />
                        <div className="mb-6">
                          <h3
                            className="text-2xl font-semibold cursor-pointer"
                            onClick={handleCopy(orden)}
                          >
                            Bs. {orden.total.sumBs}/
                            <sub className="text-lg text-gray-600">
                              ${orden.total.sumDolar}
                            </sub>
                          </h3>
                        </div>
                        <div className="relative">
                          <ul className="space-y-4">
                            {orden.pedido.map((elem) => {
                              return (
                                <li
                                  key={elem.item}
                                  className="flex items-center text-sm text-gray-500"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    className="mr-3 fill-green-500"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                      data-original="#000000"
                                    />
                                  </svg>
                                  <div className="">
                                    <span className="font-bold text-gray-700">
                                      {elem.cantidad}
                                    </span>{" "}
                                    {elem.item}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                          {keyFilt === "pagado"
                            ? orden.refs?.map((reff) => (
                                <span
                                  key={reff}
                                  className="absolute rounded-full bg-orange-600 text-center text-white p-1 font-bold right-1 bottom-1"
                                >
                                  {reff}
                                </span>
                              ))
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  {keyFilt === "por pagar" && (
                    <div className="flex justify-between mt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button color="blue" variant="link">
                            + REF
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Pagar</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Referencia
                              </Label>
                              <Input
                                id="name"
                                onChange={(e) => setRef(e.target.value)}
                                placeholder="últimos cuatro digitos"
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              variant="outline"
                              onClick={async () => {
                                if (ref.length < 1) {
                                  toast.error(
                                    "El campo de referencia esta vacio"
                                  );
                                  return;
                                }
                                await updatePagado(orden.id!, true);
                                toast.success("Pago procesado");
                              }}
                            >
                              Confirmar pago
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary">editar</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <SelectMenuEdit orden={orden} />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                  {keyFilt === "pagado" && (
                    <div className="flex justify-between mt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button color="blue" variant="link">
                            + REF
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Pagar</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Referencia
                              </Label>
                              <Input
                                id="name"
                                onChange={(e) => setRef(e.target.value)}
                                placeholder="últimos cuatro digitos"
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              variant="outline"
                              onClick={async () => {
                                if (ref.length < 1) {
                                  toast.error(
                                    "El campo de referencia esta vacio"
                                  );
                                  return;
                                }
                                await updatePagado(orden.id!, true);
                                toast.success("Pago procesado");
                              }}
                            >
                              Confirmar pago
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary">editar</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <SelectMenuEdit orden={orden} />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))
        ) : (
          <h1>Sin ordenes</h1>
        )}

        <div className="mt-5 rounded-md bg-lime-800 text-white w-44 font-bold text-xl p-1 ml-auto text-center">
          {keyFilt === "por pagar"
            ? `$ ${sumTotalsPorPagar(0)} | Bs. ${sumTotalsPorPagar(1)}`
            : `$ ${sumTotals(0)} | Bs. ${sumTotals(1)}`}
        </div>
      </div>
    </>
  );
};

export default Pedidos;
