import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";

export default function Register() {
  const [allItem, setAllItem] = useState([]);
  const [putStock, setPutStock] = useState([]);
  const registerAllItem = async () => {
    try {
      const data = await fetch("http://localhost:8080/allItems");
      const jsonData = await data.json();
      setAllItem(jsonData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    registerAllItem();
  }, []);
  useEffect(() => {
    console.log(allItem);
  }, [allItem]);

  const addPutItem = (e) => {
    setPutStock((prevState) => [
      ...prevState,
      { id: e.target.id, item_stock: e.target.value },
    ]);
  };

  return (
    <>
      <div className="registerBrock">
        <div className="listEditParentBrock">
          <div className="listEditBrock">
            {allItem.map(
              (el) =>
                el.length !== 0 && (
                  <div className="data" key={el.id}>
                    <label>
                      名前: <span>{el.item_name}</span>
                    </label>
                    {/* <label>
                      初期在庫: <span>{el.item_stock}</span>
                    </label> */}
                    <label>
                      予測在庫:
                      <input
                        type="text"
                        id={el.id}
                        onChange={addPutItem}
                        value={el.expectedInventory}
                      ></input>
                    </label>
                  </div>
                )
            )}
          </div>
        </div>
        <Modal />
      </div>
    </>
  );
}
