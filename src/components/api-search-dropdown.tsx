import { FC } from "react";
import { PedidoInfo, fullData } from "../data";

interface ListFoods {
  foods: typeof fullData;
  closeDrop: React.Dispatch<React.SetStateAction<boolean>>;
  addQuery: React.Dispatch<React.SetStateAction<string>>;
  setFoodName: React.Dispatch<React.SetStateAction<PedidoInfo>>;
}

const ApiSearchDropdown: FC<ListFoods> = ({
  foods,
  closeDrop,
  addQuery,
  setFoodName,
}) => {
  return (
    <ul className="absolute right-0 z-10 mt-2 w-56 top-0 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      {foods && foods.length
        ? foods.map((item) => (
            <li className="py-2" key={item.id}>
              <div
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-200"
                onClick={() => {
                  addQuery(item.nombre);
                  setFoodName((prev) => ({
                    ...prev,
                    item: item.nombre,
                    precio: item.precio,
                  }));
                  closeDrop(false);
                }}
              >
                {item.nombre}
              </div>
            </li>
          ))
        : null}
    </ul>
  );
};

export default ApiSearchDropdown;
