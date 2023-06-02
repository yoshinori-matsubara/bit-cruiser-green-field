import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";
import Delete from "./styles/Delete.svg";
export default function Register(props) {
  const [allItem, setAllItem] = useState([]);
  const [putStock, setPutStock] = useState([]);

  const registerAllItem = async () => {
    try {
      const data = await fetch("https://bitcruiserapi.onrender.com/allItems");
      const jsonData = await data.json();
      setAllItem(jsonData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await registerAllItem();
    })();
  }, [props.modalVisible]);

  useEffect(() => {
    console.log(allItem);
  }, [allItem]);
  useEffect(() => {
    console.log(putStock);
  }, [putStock]);
  const addPutItem = (e) => {
    setPutStock((prevState) => {
      if (prevState.length === 0) {
        return [...prevState, { id: e.target.id, item_stock: e.target.value }];
      } else if (prevState.some((item) => item.id === e.target.id)) {
        const updatedState = prevState.map((item) => {
          if (item.id === e.target.id) {
            return { ...item, item_stock: e.target.value };
          }
          return item;
        });
        return updatedState;
      } else {
        return [...prevState, { id: e.target.id, item_stock: e.target.value }];
      }
    });
  };

  const setFix = async () => {
    try {
      const data = await fetch(
        "https://bitcruiserapi.onrender.com/changeItemStocks",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(putStock),
        }
      );
      const result = await data.text();
      if (result) {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
    props.setModalVisible(false);
    // registerAllItem();
  };
  const itemAllDelete = async (func) => {
    const ans = window.confirm("バルスの呪文を唱えますか？");
    if (ans === true) {
      try {
        const data = await fetch("https://bitcruiserapi.onrender.com/delete", {
          method: "DELETE",
        });
        const result = await data.text();
        if (result) {
          console.log(result);
          func();
        }
      } catch (error) {
        console.log(error);
      }
      window.alert("すべてのアイテムを削除しました");
    } else {
      window.alert("覚悟を決めてください");
    }
  };

  return (
    <>
      <div className="registerBrock">
        <img
          src={Delete}
          alt="Delete"
          className="DeleteBtn"
          onClick={() => {
            itemAllDelete(registerAllItem);
          }}
        />
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
                      在庫:
                      <input
                        type="number"
                        id={el.id}
                        onBlur={addPutItem}
                        defaultValue={el.expectedInventory}
                        // value={el.expectedInventory}
                      ></input>
                    </label>
                  </div>
                )
            )}
          </div>
        </div>
        <Modal
          modalVisible={props.modalVisible}
          setModalVisible={props.setModalVisible}
        />
        {putStock.length > 0 && (
          <>
            <button
              className="setFixBtn"
              onClick={() => {
                setFix();
              }}
            >
              修正完了
            </button>
          </>
        )}
      </div>
    </>
  );
}
