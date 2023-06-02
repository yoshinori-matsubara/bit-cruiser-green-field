import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";

export default function Register() {
  const [allItem, setAllItem] = useState([]);

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

  return (
    <>
      <div className="registerBrock">
        <div className="listEditParentBrock">
          <div className="listEditBrock">
            {allItem.map(
              (el) =>
                el.length !== 0 && (
                  <div className="data" key={el.id} id={el.id}>
                    <label>
                      名前: <span>{el.item_name}</span>
                    </label>
                    {/* <label>
                      初期在庫: <span>{el.item_stock}</span>
                    </label> */}
                    <label>
                      本日時点の予測在庫量:<span>{el.expectedInventory}</span>{" "}
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
