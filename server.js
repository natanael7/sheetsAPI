const express = require("express");
const app = express();
const spreadsheet = require("./spreadsheet.js");
const { Summary } = require("./classes.js");

let customers = [];
let orders = [];

async function getData() {
  await spreadsheet.ordersData(orders, customers);
  console.log("data grabbed");
}

getData();
app.listen(3000, () => console.log("listening"));
app.use(express.static("./public"));
app.use(express.json());

app.get("/order/:id", (req, res, next) => {
  res.json(orders[req.params.id - 1]);
  res.end;
});
app.get("/customer/:id", (req, res, next) => {
  res.json([req.params.id - 1]);
  res.end;
});
app.get("/date/:date", (req, res, next) => {
  function validate(order) {
    return order.date == req.params.date;
  }
  res.json(orders.filter((order) => validate(order)));
  res.end;
});
app.get("/interval/:from-:to", (req, res, next) => {
  function validate(order) {
    return order.date >= req.params.from && order.date <= req.params.to;
  }
  res.json(orders.filter((order) => validate(order)));
  res.end;
});
app.get("/summary", (req, res, next) => {
  let summ = new Summary(orders, customers);
  res.json(summ);
  res.end;
});
app.get("/summary/:from-:to", (req, res, next) => {
  function validate(order) {
    return order.date >= req.params.from && order.date <= req.params.to;
  }
  let customersInDay = []
  const ordersInDay = orders.filter((order) => validate(order));
  ordersInDay.forEach(order => { 
    customersInDay.push(order.customer)
  })
  let summ = new Summary(ordersInDay, customersInDay);
  res.json(summ);
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
      obj.average = (obj.sum / obj.count) * 5;
    });
    res.json(result);
  }
  getdata();
  res.end;
});
app.get("/ordersByMonth", (req, res, next) => {
  async function getdata() {
    let loc = -1;
    function location(date, arr) {
      arr.forEach((obj, index) => {
        if (obj.days == parseInt(date.slice(3, 5))) {
          loc = index;
        }
      });
      return loc;
    }
    await spreadsheet.ordersData(orders, customers);
    let result = [],
      dates = [];
    orders.forEach((order) => {
      if (dates.indexOf(parseInt(order.date.slice(3, 5))) == -1)
        dates.push(parseInt(order.date.slice(3, 5)));
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
      obj.average = (obj.sum / obj.count) * 100;
    });
    res.json(result);
  }
  getdata();
  res.end;
});
app.post("/filter", function (request, response) {
  response.send(request.body); // echo the result back
});
