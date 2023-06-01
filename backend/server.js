const express = require("express");
const app = express();

const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile.js")[environment];
const knex = require("knex")(config);
const PORT = 8080;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**
 * @param {string} startDay - 計算開始日を入力
 * @param {string} endDay - 計算終了日を入力
 * @returns { number } - endDayとstartDay の差分の日数を返す
 */
const calculateDiffInDays = (startDay, endDay) => {
  const d1 = new Date(startDay);
  const d2 = new Date(endDay);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDay;
};

// GET /:buyingDay/:nextBuyingDay 次の買い物日までに必要な物品と個数のリストを返す
app.get("/api/:buyingDay/:nextBuyingDay", async (req, res) => {
  const result = [];
  const diff = calculateDiffInDays(
    req.params.buyingDay,
    req.params.nextBuyingDay
  );
  const db = await knex.select("*").from("items");

  for (let i = 0; i < db.length; i++) {
    // buyingDay時点での在庫数を計算
    let date = new Date(db[i].registration_day);
    date = new Date(date);
    date.setDate(date.getDate() + 1);
    const stockOfBuyingDay =
      db[i].item_stock -
      calculateDiffInDays(
        date.toISOString().split("T")[0],
        req.params.buyingDay
      ) /
        db[i].consumption_day;
    // nextBuyingDay時点での在庫数を計算
    const stockOfNextBuyingDay =
      stockOfBuyingDay - diff / db[i].consumption_day;

    console.log(date);
    console.log(`${db[i].item_name},stockOfBuyingDay:${stockOfBuyingDay}`);
    console.log(
      `${db[i].item_name},stockOfNextBuyingDay:${stockOfNextBuyingDay}`
    );
    // nextBuyingDay時点での在庫数が閾値以下ならリストに物品名と必要個数を追加
    if (stockOfNextBuyingDay < db[i].notification_stock) {
      result.push({
        id: db[i].id,
        itemName: db[i].item_name,
        stockOfBuyingDay: Math.ceil(stockOfBuyingDay),
        quantity: Math.ceil(
          Math.ceil(db[i].notification_stock - stockOfNextBuyingDay)
        ),
      });
    }
  }
  console.log(result);
  res.status(200).json(result);
});

// POST / フロントから送信された消耗品情報をitemsに追加
app.post("/api", async (req, res) => {
  const obj = req.body;
  try {
    await knex("items").insert({
      item_name: obj.itemName,
      item_stock: obj.itemStock,
      consumption_day: obj.consumptionDay,
      notification_stock: obj.notificationStock,
      registration_day: obj.registrationDay,
    });
    const result = await knex.select("*").from("items");
    res.status(200).json(result);
  } catch (e) {
    console.error("Error", e);
    res.status(500);
  }
});

// GET:
app.get("/allItems", async (req, res) => {
  // 予想在庫量の計算

  const result = [];

  const db = await knex.select("*").from("items");
  for (let i = 0; i < db.length; i++) {
    let date = new Date(db[i].registration_day);
    date = new Date(date);
    date.setDate(date.getDate() + 1);
    let stockOfBuyingtoDay =
      db[i].item_stock -
      calculateDiffInDays(date.toISOString().split("T")[0], new Date()) /
        db[i].consumption_day;

    stockOfBuyingtoDay = Math.ceil(stockOfBuyingtoDay);

    result.push({
      id: db[i].id,
      item_name: db[i].item_name,
      item_stock: db[i].item_stock,
      consumption_day: db[i].consumption_day,
      notification_stock: db[i].notification_stock,
      registration_day: db[i].registration_day,
      expectedInventory: stockOfBuyingtoDay,
    });
    console.log("stockOfBuyingtoDay", stockOfBuyingtoDay);
  }

  // const allItems = await function () {
  //   return knex("items")
  //     .select({
  //       id: "id",
  //       item_name: "item_name",
  //       item_stock: "item_stock",
  //       consumption_day: "consumption_day",
  //       notification_stock: "notification_stock",
  //       registration_day: "registration_day",
  //     })
  // }
  // const result = await allItems()

  res.send(result);
});

// PUT:
app.put("/purchaseItem", async (req, res) => {
  console.log(req.body);
  try {
    await Promise.all(
      req.body.map(async (data) => {
        const { id, itemName, stockOfBuyingDay, quantity } = data;
        await knex("items")
          .where({ id: id })
          .update({
            item_stock: stockOfBuyingDay + quantity,
          });
      })
    );
    console.log();
    res.status(200).send("購入数を補充しました。");
  } catch (e) {
    console.error("Error", e);
    res.status(500);
  }
});

app.listen(PORT, () => {
  console.log(`I am now waiting for incoming HTTP traffic on port ${PORT}!`);
});
