const express = require("express");
const app = express();
const spreadsheet = require("./spreadsheet.js");
const { Summary } = require("./classes.js");

let customers = [];
let orders = [];
function date2days(date) {
  let arr = date.split(".");
  let s = 0;
  s += parseInt(arr[0]);
  s += parseInt(arr[1]) * 31;
  s += parseInt(arr[2]) * 365;
  return s;
}
async function getData() {
  await spreadsheet.ordersData(orders, customers);
  console.log("data grabbed");
}

getData();
app.listen(3000, () => console.log("listening"));
app.use(express.static("./public"));
app.use(express.json());

//SHOW
//Order
app.get("/show/order/:id", (req, res, next) => {
  res.json(orders[req.params.id - 1]);
  res.end;
});
app.get("/show/order/interval/:from-:to", (req, res, next) => {
  function validate(order) {
    return (
      date2days(order.date) >= date2days(req.params.from) &&
      date2days(order.date) <= date2days(req.params.to)
    );
  }
  const result = orders.filter((order) => validate(order));
  res.json(result);
  res.end;
});

//Customer
app.get("/show/customer/:id", (req, res, next) => {
  res.json(customers[req.params.id - 1]);
  res.end;
});
app.get("/show/customers/interval/:from-:to", (req, res, next) => {
  function validate(order) {
    return (
      date2days(order.date) >= date2days(req.params.from) &&
      date2days(order.date) <= date2days(req.params.to)
    );
  }
  let customersInDay = [];
  const ordersInDay = orders.filter((order) => validate(order));
  ordersInDay.forEach((order) => {
    customersInDay.push(order.customer);
  });
  res.json(customersInDay);
  res.end;
});

//Summary
app.get("/show/summary", (req, res, next) => {
  let summ = new Summary(orders, customers);
  res.send(summ);
  res.end;
});
app.get("/show/summary/interval/:from-:to", (req, res, next) => {
  function validate(order) {
    return (
      date2days(order.date) >= date2days(req.params.from) &&
      date2days(order.date) <= date2days(req.params.to)
    );
  }
  let customersInDay = [];
  const ordersInDay = orders.filter((order) => validate(order));
  ordersInDay.forEach((order) => {
    customersInDay.push(order.customer);
  });
  let summ = new Summary(ordersInDay, customersInDay);
  res.json(summ);
  res.end;
});

//Filter
app.post("/filter", (req, res) => {
  function validate(order) {
    for (const property in filters)
      if (order[property] != filters[property]) return false;
    return true;
  }

  let filters = req.body;
  let header = { show: req.body.show, filterBy: req.body.filterBy };
  delete filters.show;
  delete filters.filterBy;
  for (const property in filters)
    console.log(`${property}: ${filters[property]}`);

  let result = undefined;

  switch (header.filterBy) {
    case "order":
      result = orders.filter((order) => validate(order));
      break;
    case "customer":
      result = orders.filter((order) => validate(order["customer"]));
      break;
    case "productSet":
      result = orders.filter((order) => validate(order["productSet"]));
      break;
    default:
      res.end();
  }
  switch (header.show) {
    case "order":
      res.send(result);
      break;
    case "customer":
      let resultCustomers = [];
      result.forEach((order) => {
        resultCustomers.push(order['customer']);
      });
      res.send(resultCustomers);
      break;
    case "summary":
      let thisCustomers = [];
      result.forEach((order) => {
        thisCustomers.push(order.customer);
      });
      let summ = new Summary(result, thisCustomers);
      console.log(summ);
      res.send(summ);
      break;
    default:
      res.end();
  }

  res.end;
});

//EXPERIMENTAL
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

