import React, { useState } from "react";
import addBtn from "./components/styles/add.svg";
export function Modal(props) {
  // model関連

  const openModal = () => {
    props.setModalVisible(true);
  };

  const closeModal = () => {
    props.setModalVisible(false);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  //   登録処理
  const [itemName, setItemName] = useState("");
  const [itemStock, setItemStock] = useState(0);
  const [consumptionDay, setConsumptionDay] = useState(0);
  const [notificationStock, setNotificationStock] = useState(0);

  const getItemName = (e) => setItemName(e.currentTarget.value);
  const getItemStock = (e) => setItemStock(e.currentTarget.value);
  const getConsumptionDay = (e) => setConsumptionDay(e.currentTarget.value);
  const getNotificationStock = (e) =>
    setNotificationStock(e.currentTarget.value);

  const registerItem = async (func) => {
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
    await fetch("http://localhost:8080/api", {
      method,
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.status === 200)
          console.log(`${JSON.stringify(body)}が登録できました！`);
        func();
      })
      .catch((res) => console.error(`${body}が登録できませんでした！`));
  };

  return (
    <div>
      <img
        src={addBtn}
        onClick={openModal}
        alt="addBtn"
        className="itemAddBtn"
      ></img>

      {props.modalVisible && (
        <div id="modalArea" className="modalArea" onClick={closeModal}>
          {/* Modal Content */}
          <div className="addItemFrom" onClick={stopPropagation}>
            <h2>消耗品の在庫登録</h2>
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
            <button
              onClick={() => {
                registerItem(closeModal);
              }}
            >
              登録
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
