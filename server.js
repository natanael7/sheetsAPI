class Summary {
  constructor(orders) {
    this.orderCount = orders.length;
    this.products = this.countProducts(orders);
    this.orderSum = this.sumIndex(orders, "sum");
    this.sumToCheckOut = this.sumIndex(orders, "realSum");
    this.averagePrice = Number((this.orderSum / this.orderCount).toFixed(2));
    this.newCustomers = this.countNewCustomers(orders);
    this.microProductsCount = this.countMicroProducts(orders);
    this.macroProductsCount = this.countMacroProducts();
    this.deliveryMethodCount = this.countIndex(orders, "deliveryMethod");
    this.payingMethodCount = this.countIndex(orders, "payingMethod");
    this.regionCount = this.countRegion(orders);
  }
  countIndex(arr, prop) {
    let obj = {};
    arr.forEach((el) => {
      if (obj[el[prop]] == undefined) obj[el[prop]] = 1;
      else obj[el[prop]]++;
    });
    return obj;
  }
  sumIndex(arr, prop) {
    let s = 0;
    arr.forEach((el) => {
      s += parseInt(el[prop]);
    });
    return s;
  }
  countNewCustomers(arr) {
    return 0;
  }
  countMacroProducts() {
    let obj = {};
    obj.Piepteni = this.microProductsCount.piep;
    obj.Huse = this.microProductsCount.h;
    obj.Sanitare = this.microProductsCount.cles + this.microProductsCount.bet
    obj.Periute = this.products - obj.Huse - obj.Piepteni - obj.Sanitare;
    if (isNaN(obj.Periute)) delete obj.Periute;
    return obj;
  }
  countMicroProducts(arr) {
    let obj = {};
    arr.forEach((order) => {
      order.productSet.forEach((product) => {
        if (Number.isInteger(parseInt(product.color)))
          product.color='refurbished'
        if (obj[product.color] == undefined) obj[product.color] = 1;
        else obj[product.color]++;
      });
    });

    return obj;
  }
  countRegion(arr) {
    let obj = {};
    arr.forEach((el) => {
      if (obj[el["customer"]["region"]] == undefined)
        obj[el["customer"]["region"]] = 1;
      else obj[el["customer"]["region"]]++;
    });
    return obj;
  }
  countProducts(arr) {
    let s = 0;
    let obj = this.countMicroProducts(arr);
    for (const property in obj) s += obj[property];
    return s;
  }
}

const express = require("express");
const app = express();
const spreadsheet = require("./spreadsheet.js");

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
    let summ = new Summary(orders);
    res.json(summ);
  }
  getdata();
  res.end;
});
app.get("/summary/interval/:from-:to", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders, customers);
    let ordersInDay = [];
    for (let i = 0; i < orders.length; i++)
      if (orders[i].date >= req.params.from && orders[i].date <= req.params.to)
        ordersInDay.push(orders[i]);
    let summ = new Summary(ordersInDay);
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
