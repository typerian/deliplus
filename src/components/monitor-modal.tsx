import React, { useState, useEffect } from "react";

function MonitorModal() {
  const [currencyData, setCurrencyData] = useState({});
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://api.example.com/latest"); // Reemplaza con tu API
      const data = await response.json();
      setCurrencyData(data.rates);
    };

    fetchData();
  }, []);

  const convert = () => {
    const rate = currencyData[toCurrency] / currencyData[fromCurrency];
    const convertedAmount = amount * rate;
    console.log(convertedAmount); // Aquí puedes mostrar el resultado en la interfaz
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
      />
      <select
        value={fromCurrency}
        onChange={(e) => {
          setFromCurrency(e.target.value);
        }}
      >
        {/* Opciones de monedas basadas en currencyData */}
      </select>
      <select
        value={toCurrency}
        onChange={(e) => {
          setToCurrency(e.target.value);
        }}
      >
        {/* Opciones de monedas basadas en currencyData */}
      </select>
      <button onClick={convert}>Convertir</button>
    </div>
  );
}

export default MonitorModal;
