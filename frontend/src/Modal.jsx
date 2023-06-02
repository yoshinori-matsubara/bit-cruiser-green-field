import React, { useState } from "react";
// import addBtn from "./components/styles/add.svg";
import { AiFillPlusSquare } from "react-icons/ai";
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
    if (
      itemName === "" ||
      itemStock <= 0 ||
      consumptionDay <= 0 ||
      notificationStock <= 0
    ) {
      window.alert("入力が不正です。");
      return console.error("入力した値が不正又は未入力のため処理を停止");
    }
    const registrationDay = new Date();
    const method = "POST";
    const body = {
      itemName,
      itemStock,
      consumptionDay,
      notificationStock,
      registrationDay,
    };
    console.log(body);
    const headers = {
      "Content-Type": "application/json",
    };

    await fetch(props.URL + "/api", {
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
      <AiFillPlusSquare
        onClick={openModal}
        alt="addBtn"
        className="itemAddBtn"
      ></AiFillPlusSquare>

      {props.modalVisible && (
        <div id="modalArea" className="modalArea" onClick={closeModal}>
          {/* Modal Content */}
          <div className="addItemFrom" onClick={stopPropagation}>
            <h2 className="modalTextH">商品の在庫登録</h2>
            <div className="addItemsBrock">
              <div className="addItems">
                <label className="modalText">品名</label>
                <div className="valueBrock">
                  <input
                    className="modalValue"
                    type="text"
                    onBlur={getItemName}
                  ></input>
                </div>
              </div>
              <div className="addItems">
                <label className="modalText">在庫量</label>
                <div className="valueBrock">
                  <input
                    className="modalValue"
                    type="number"
                    onBlur={getItemStock}
                  ></input>
                </div>
              </div>
              <div className="addItems">
                <label className="modalText">何日で１個使うか？</label>
                <div className="valueBrock">
                  <input
                    className="modalValue"
                    type="number"
                    onBlur={getConsumptionDay}
                  ></input>
                </div>
              </div>
              <div className="addItems">
                <label className="modalText">下回りたくない</label>
                <div className="valueBrock">
                  <input
                    className="modalValue"
                    type="number"
                    onBlur={getNotificationStock}
                  ></input>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                registerItem(closeModal);
              }}
              className="addItemsBtn"
            >
              登録
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
