const express = require("express");
const app = express();
const spreadsheet = require("./spreadsheet.js");
const { Summary } = require("./classes.js");

let customers = [];
let orders = [];

app.listen(3000, () => console.log("listening"));
app.use(express.static("./public"));

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
    let max = { prop: customers[0][req.params.prop], index: 0 };
    for (let i = 0; i < customers.length; i++)
      if (customers[i][req.params.prop] > max.prop) {
        max.index = i;
        max.prop = customers[i][req.params.prop];
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
app.get("/ordersByDay", (req, res, next) => {
  async function getdata() {
    let loc = -1;
    function location(date, arr) {
      arr.forEach((obj, index) => {
        if (obj.days == date) {
          loc = index;
        }
      });
      return loc;
    }
    await spreadsheet.ordersData(orders, customers);
    let result = [],
      dates = [];
    orders.forEach((order) => {
      if (dates.indexOf(order.date) == -1) dates.push(order.date);
    });
    dates.forEach((date, index) => {
      result[index] = { days: date, count: 0, sum: 0 };
    });
    orders.forEach((order) => {
      result[location(order.date, result)].count++;
      result[location(order.date, result)].sum += order.sum;
    });
    result.forEach((obj) => {
      obj.sum = obj.sum / 100;
      obj.average = obj.sum / obj.count * 5;
    });
    res.json(result);
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
    let customersInDay = [];
    for (let i = 0; i < orders.length; i++)
      if (
        orders[i].date >= req.params.from &&
        orders[i].date <= req.params.to
      ) {
        customersInDay.push(orders[i].customer);
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
        if (order[arr[i][0]][arr[i][1]] != arr[i][2]) return false;
      } else if (order[arr[i][0]] != arr[i][1]) return false;
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
