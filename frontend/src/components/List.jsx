import React, { useState } from "react";

export function List() {
  const [list, setList] = useState([]);
  const [buyingDay, setBuyingDay] = useState("");
  const [nextBuyingDay, setNextBuyingDay] = useState("");

  // ステート更新関数
  // yyyy-mm-dd変更
  const getNextBuyingDay = (e) => {
    setNextBuyingDay(e.currentTarget.value);
    if (buyingDay !== "") createList();
  };
  
  // ステート更新関数
  const getBuyingDay = (e) => {
    setBuyingDay(e.currentTarget.value);
    if (nextBuyingDay !== "") createList();
  };

  // 一覧作成
  const createList = async () => {
    const data = await fetch(`/api/${buyingDay}/${nextBuyingDay}`);
    const newArray = data.map(obj => {
      // 暫定でこの形
      return <li>{obj.itemName}{obj.quantity}</li>
    });
    setList(newArray);
  };

  return (
    <div>
      <label>次回のお買い物日</label>
      <input type="date" onBlur={getNextBuyingDay}></input>
      <br></br>

      <label>いつのお買物リスト？</label>
      <input type="date" onBlur={getBuyingDay}></input>
      <br></br>
      {list}

    </div>
  );
}
