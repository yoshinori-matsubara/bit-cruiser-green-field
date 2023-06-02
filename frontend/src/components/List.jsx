import React, { useState, useEffect } from "react";

export function List(props) {
  const [list, setList] = useState([]);
  const [putData, setPutData] = useState([]);
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
    const data = await fetch(`${props.URL}/api/${buyingDay}/${nextBuyingDay}`)
      .then((res) => res.json())
      .then((res) => {
        setPutData(res);
        const newArray = res.map((obj) => {
          // 暫定でこの形
          return (
            <div className="dataBrock" key={obj.id}>
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

  const putBuyData = async () => {
    try {
      const data = await fetch(props.URL + "/purchaseItem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(putData),
      });
      const result = await data.text();
      if (result) {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="listBrock">
      <div className="nextBuyBrock">
        <label>次のお買い物予定日</label>
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
      {list.length > 0 && (
        <>
          <button className="buyBtn" onClick={putBuyData}>
            購入した！
          </button>
        </>
      )}
    </div>
  );
}
