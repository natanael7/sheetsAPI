const json = require("./params.json");

class Order {
  constructor(...args) {
    let props = json.orderSchema;
    args.forEach((property, index) => {
      let tempProp = property;
      if (props[index]["type"] == "number") tempProp = parseInt(tempProp);
      else if (props[index]["type"] == "text")
        tempProp = tempProp.toLowerCase();
      this[props[index]["prop"]] = tempProp;
    });
    props.forEach((prop, index) => {
      if (
        prop["type"] == "defineArray" &&
        args[index] == undefined &&
        this[prop["prop"]] == undefined
      )
        this[prop["prop"]] = [];
    });
    props.forEach((prop, index) => {
      if (prop["type"] == "defineInt" && args[index] == undefined)
        this[prop["prop"]] = 0;
    });
  }
}
class Customer {
  constructor(...args) {
    let props = json.customerSchema;
    args.forEach((property, index) => {
      let tempProp = property;
      if (props[index]["type"] == "number") tempProp = parseInt(tempProp);
      else if (props[index]["type"] == "text")
        tempProp = tempProp.toLowerCase();
      this[props[index]["prop"]] = tempProp;
    });
    props.forEach((prop, index) => {
      if (
        prop["type"] == "defineArray" &&
        args[index] == undefined &&
        this[prop["prop"]] == undefined
      )
        this[prop["prop"]] = [];
    });
    props.forEach((prop, index) => {
      if (prop["type"] == "defineInt" && args[index] == undefined)
        this[prop["prop"]] = 0;
    });
  }
}
class Product {
  constructor(...args) {
    let props = json.productSchema;
    args.forEach((property, index) => {
      let tempProp = property;
      if (props[index]["type"] == "number") tempProp = parseInt(tempProp);
      else if (props[index]["type"] == "text")
        tempProp = tempProp.toLowerCase();
      this[props[index]["prop"]] = tempProp;
    });
    props.forEach((prop, index) => {
      if (
        prop["type"] == "defineArray" &&
        args[index] == undefined &&
        this[prop["prop"]] == undefined
      )
        this[prop["prop"]] = [];
    });
    props.forEach((prop, index) => {
      if (prop["type"] == "defineInt" && args[index] == undefined)
        this[prop["prop"]] = 0;
    });
  }
}
class Row {
  constructor(data) {
    let props = json.header2rowSchema;
    props.forEach((property, index) => {
      this[property["prop"]] = data[property["rowTitle"]];
    });
  }
}
class Circular {
  constructor(order) {
    for (const property in order) this[property] = order[property];
    this.customer = "[Circular]";
  }
}
class Summary {
  constructor(orders, customers) {
    this.orderCount = orders.length;
    this.products = this.countProducts(orders);
    this.orderSum = this.sumIndex(orders, "sum");
    this.sumToCheckOut = this.sumIndex(orders, "realSum");
    this.averagePrice = Number((this.orderSum / this.orderCount).toFixed(2));
    this.newCustomers = this.countNewCustomers(orders, customers);
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
  countNewCustomers(orders, customers) {
    let total = 0;
    let doubled = 0;
    orders.forEach((order) => {
      if (order.date == order.customer.date) total++;
    });
    customers.forEach((customer) => {
      customer.orders.forEach((order) => {
        if (order.date == customer.orders[0].date) doubled++;
      });
      doubled--;
    });
    return total - doubled;
  }
  countMacroProducts() {
    let obj = {};
    obj.Piepteni = this.microProductsCount.piep;
    if (isNaN(obj.Piepteni)) obj.Piepteni = 0;
    obj.Huse = this.microProductsCount.h;
    if (isNaN(obj.Huse)) obj.Huse = 0;
    obj.Sanitare = this.microProductsCount.cles + this.microProductsCount.bet;
    if (isNaN(obj.Sanitare)) obj.Sanitare = 0;
    obj.Periute = this.products - obj.Huse - obj.Piepteni - obj.Sanitare;
    for (const property in obj) {
      if (!obj[property]) delete obj[property];
    }
    return obj;
  }
  countMicroProducts(arr) {
    let obj = {};
    arr.forEach((order) => {
      order.productSet.forEach((product) => {
        if (Number.isInteger(parseInt(product.color)))
          product.color = "refurbished";
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
exports.Order = Order;
exports.Customer = Customer;
exports.Product = Product;
exports.Row = Row;
exports.Circular = Circular;
exports.Summary = Summary;
