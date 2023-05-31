import React, { useState } from "react";

export default function Register() {
  const [itemName, setItemName] = useState("");
  const [itemStock, setItemStock] = useState(0);
  const [consumptionDay, setConsumptionDay] = useState(0);
  const [notificationStock, setNotificationStock] = useState(0);

  const getItemName = (e) => setItemName(e.currentTarget.value);
  const getItemStock = (e) => setItemStock(e.currentTarget.value);
  const getConsumptionDay = (e) => setConsumptionDay(e.currentTarget.value);
  const getNotificationStock = (e) =>
    setNotificationStock(e.currentTarget.value);

  const registerItem = () => {
    const registrationDay = new Date();
    const method = "POST";
    const body = {
      itemName,
      itemStock,
      consumptionDay,
      notificationStock,
      registrationDay,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    fetch("http://localhost:8080/api", {
      method,
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.status === 200)
          console.log(`${JSON.stringify(body)}が登録できました！`);
      })
      .catch((res) => console.error(`${body}が登録できませんでした！`));
  };

  return (
    <div>
      <h1>消耗品の在庫登録</h1>
      <label>品名</label>
      <input type="text" onBlur={getItemName}></input>
      <br></br>
      <label>在庫量</label>
      <input type="number" onBlur={getItemStock}></input>
      <br></br>
      <label>何日で１個使うか？</label>
      <input type="number" onBlur={getConsumptionDay}></input>
      <br></br>
      <label>下回りたくない</label>
      <input type="number" onBlur={getNotificationStock}></input>
      <br></br>
      <button onClick={registerItem}>登録</button>
    </div>
  );
}
