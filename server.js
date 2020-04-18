const express = require('express')
const app = express()
const spreadsheet = require("./spreadsheet.js");

let orders = [];

app.listen(3000, () => console.log('listening'))
app.use(express.static('public'))
app.get("/api", function (req, res) {
  res.json("GET request to the homepage");
  console.log('request')
  res.end;
});
app.get("/order/:orderId", (req, res, next) => {
  async function getdata() {
    await spreadsheet.ordersData(orders);
    res.json(orders[req.params.orderId-1])
  }
  getdata()
  res.end;
});
