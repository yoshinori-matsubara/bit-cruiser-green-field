import React, { useState } from "react";

export function List() {
  const [list, setList] = useState([]);
  const [buyingDay, setBuyingDay] = useState("");
  const [nextBuyingDay, setNextBuyingDay] = useState("");

  // ステート更新関数
  const getNextBuyingDay = (e) => {
    const inputDate = e.currentTarget.value;
    setNextBuyingDay(((inputDate) => inputDate)());
    console.log(nextBuyingDay);
    // if (buyingDay !== "") {
    //   createList();
    // }
  };

  // ステート更新関数
  const getBuyingDay = (e) => {
    const inputDate = e.currentTarget.value;
    setBuyingDay(inputDate);
    console.log(buyingDay);
    // if (nextBuyingDay !== "") {
    //   createList();
    // }
  };

  // 一覧作成
  const createList = async () => {
    console.log("test");
    const data = await fetch(
      `http://localhost:8080/api/${buyingDay}/${nextBuyingDay}`
    );
    console.log(data);
    const newArray = data.map((obj) => {
      // 暫定でこの形
      return (
        <li>
          {obj.itemName}
          {obj.quantity}
        </li>
      );
    });
    setList(newArray);
  };

  return (
    <div>
      <label>次回のお買い物日</label>
      <input type="date" onChange={getNextBuyingDay}></input>
      <br></br>

      <label>いつのお買物リスト？</label>
      <input type="date" onChange={getBuyingDay}></input>
      <br></br>
      {list}
    </div>
  );
}
