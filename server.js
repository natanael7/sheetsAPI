const express = require("express");
const app = express();
const spreadsheet = require("./spreadsheet.js");

let customers = [];
let orders = [];

app.listen(3000, () => console.log("listening"));
app.use(express.static("public"));
app.get("/api", function (req, res) {
  res.json("GET request to the homepage");
  console.log("request");
  res.end;
});
app.get("/order/:id", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    res.json(orders[req.params.id - 1]);
  }
  getdata();
  res.end;
});
app.get("/customer/:id", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    res.json(customers[req.params.id - 1]);
  }
  getdata();
  res.end;
});
app.get("/date/:date", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    let ordersInDay = [];
    for (let i = 0; i < orders.length; i++)
      if (orders[i].date == req.params.date) ordersInDay.push(orders[i]);
    res.json(ordersInDay);
  }
  getdata();
  res.end;
});
