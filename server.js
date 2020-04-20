const express = require("express");
const app = express();
const spreadsheet = require("./spreadsheet.js");
const {Summary} = require('./classes.js')

let customers = [];
let orders = [];

app.listen(3000, () => console.log("listening"));
app.use(express.static("public"));
app.get("/api/:criteria1.:value1", function (req, res) {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    res.json(orders);
    res.end;
  }
  getdata();
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
app.get("/customer/max/:prop", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    let max = { prop : customers[0][req.params.prop], index : 0}
    for (let i = 0; i < customers.length; i++)
      if (customers[i][req.params.prop] > max.prop) {
        max.index = i
        max.prop=customers[i][req.params.prop]
      }
    res.json(customers[max.index]);
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
app.get("/interval/:from-:to", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    let ordersInDay = [];
    for (let i = 0; i < orders.length; i++)
      if (orders[i].date >= req.params.from && orders[i].date <= req.params.to)
        ordersInDay.push(orders[i]);
    res.json(ordersInDay);
  }
  getdata();
  res.end;
});
app.get("/summary", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    let summ = new Summary(orders, customers);
    res.json(summ);
  }
  getdata();
  res.end;
});
app.get("/summary/interval/:from-:to", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    let ordersInDay = [];
    let customersInDay = []
    for (let i = 0; i < orders.length; i++)
      if (orders[i].date >= req.params.from && orders[i].date <= req.params.to) {
        customersInDay.push(orders[i].customer)
        ordersInDay.push(orders[i]);
      }
    let summ = new Summary(ordersInDay, customersInDay);
    res.json(summ);
  }
  getdata();
  res.end;
});
app.get("/filter/*", (req, res, next) => {
  function check(arr, order) {
    for (let i = 0; i < arr.length; i++)
      if (arr[i].length == 3) {
        if (order[arr[i][0]][arr[i][1]] != arr[i][2])
          return false
      }
      else if (order[arr[i][0]] != arr[i][1]) return false;
    return true;
  }
  let result = [];
  let arr = req.params[0].split("/");
  for (let i = 0; i < arr.length; i++) arr[i] = arr[i].split(":");

  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    for (let i = 0; i < orders.length; i++)
      if (check(arr, orders[i])) result.push(orders[i]);
    res.json(result);
  }
  getdata();
  res.end;
});
