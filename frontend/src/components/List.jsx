import React, { useState, useEffect } from "react";

export function List() {
  const [list, setList] = useState([]);
  const [buyingDay, setBuyingDay] = useState("");
  const [nextBuyingDay, setNextBuyingDay] = useState("");

  useEffect(() => {
    console.log(list);
  }, [list]);
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
            <div className="dataBrock">
              <li key={obj.id} className="dataLi">
                {obj.itemName}
              </li>
              <span className="dataSpan">{obj.quantity}個</span>
            </div>
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
    <div className="listBrock">
      <div className="nextBuyBrock">
        <label>直近の次のお買い物予定日</label>
        <input type="date" onChange={getNextBuyingDay}></input>
      </div>

      <div className="choiceBuyBrock">
        <label>
          <input
            type="date"
            onChange={getBuyingDay}
            style={{ marginLeft: "1vh", marginRight: "1vh" }}
          ></input>
          の買い物リスト
        </label>
      </div>
      <br></br>
      <div className="listParentBrock">
        <div className="listDateBrock">{list}</div>
      </div>
    </div>
  );
}
