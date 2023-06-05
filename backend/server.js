const express = require("express");
const app = express();

const environment = process.env.NODE_ENV || "development";
const config = require("./knexfile.js")[environment];
const knex = require("knex")(config);
const PORT = 8080;

app.use(express.json());

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://bitcruiser.onrender.com"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
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
        quantity: Math.ceil(db[i].notification_stock - stockOfNextBuyingDay),
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

// GET:在庫一覧（現在の予想在庫量含む）の取得
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

    if (db[i].item_stock >= stockOfBuyingtoDay) {
      stockOfBuyingtoDay = Math.ceil(stockOfBuyingtoDay);
    } else {
      stockOfBuyingtoDay = Math.ceil(db[i].item_stock);
    }

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
  res.send(result);
});

// PUT: 現在の正在庫数を受け取り、在庫数と登録日を更新する
// 想定req
// [
//     {
//     "id": 2,
//     "item_stock": 3
//   },
//     {
//     "id": 3,
//     "item_stock": 4
//   }
// ]
app.put("/changeItemStocks", async (req, res) => {
  req.body.map(async (data) => {
    const { id, item_stock } = data;
    const today = new Date();
    await knex("items")
      .where({ id: id })
      .update({ item_stock: item_stock, registration_day: today });
  });
  console.log("在庫量登録リクエストデータ", req.body);
  res.send("在庫量と登録日更新完了");
});
// PUT:「購入しました」エンドポイント
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
            registration_day: new Date(),
          });
      })
    );
    console.log();
    res.status(200).send("購入数を補充しました!");
  } catch (e) {
    console.error("Error", e);
    res.status(500);
  }
});

app.delete("/delete", async (req, res) => {
  await knex("items").del();
  res.send("全消ししたよ");
});

app.listen(PORT, () => {
  console.log(`I am now waiting for incoming HTTP traffic on port ${PORT}!`);
});
