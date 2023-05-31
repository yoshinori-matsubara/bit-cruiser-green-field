import React, { useState, useEffect } from "react";

export function List() {
  const [list, setList] = useState([]);
  const [buyingDay, setBuyingDay] = useState("");
  const [nextBuyingDay, setNextBuyingDay] = useState("");

  // ステート更新関数
  const getNextBuyingDay = (e) => {
    const inputDate = e.currentTarget.value;
    setNextBuyingDay(inputDate);
  };

  // ステート更新関数
  const getBuyingDay = (e) => {
    const inputDate = e.currentTarget.value;
    setBuyingDay(inputDate);
  };

  // 一覧作成
  const createList = async () => {
    // console.log("test");
    // console.log(nextBuyingDay);
    // console.log(buyingDay);
    const data = await fetch(
      `http://localhost:8080/api/${buyingDay}/${nextBuyingDay}`
    )
      .then((res) => res.json())
      .then((res) => {
        const newArray = res.map((obj) => {
          // 暫定でこの形
          return (
            <li key={obj.id}>
              {obj.itemName} : {obj.quantity}個
            </li>
          );
        });
        setList(newArray);
      });
  };

  useEffect(() => {
    if (buyingDay !== "" && nextBuyingDay !== "") {
      createList();
    }
  }, [buyingDay, nextBuyingDay]);

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
