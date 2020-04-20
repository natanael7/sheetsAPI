let json = require("./params.json");
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
  constructor(...args) {
    let props = json.rowSchema;
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
class Circular {
  constructor(order) {
    this.customer = "[Circular]";
    this.productSet = order.productSet;
    this.number = order.number;
    this.date = order.date;
    this.status = order.status;
    this.sum = order.sum;
    this.payingMethod = order.payingMethod;
    this.deliveryMethod = order.deliveryMethod;
    this.track = order.track;
    this.remark = order.remark;
    this.site = order.site;
    this.message = order.message;
    this.realSum = order.realSum;
  }
}
let rows = [];
let products = [];

const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./client_secret.json");

function preventCustomerDuplicate(customers, search) {
  for (let i = 0; i < customers.length; i++)
    if (customers[i].account == search.account)
      return { status: false, actual: customers[i] };
  return { status: true };
}
function preventOrderDuplicate(orders, search) {
  for (let i = 0; i < orders.length; i++)
    if (orders[i].number == search.number) return false;
  return true;
}
function rowSet(data) {
  for (let i = 0; i < data.length; i++) {
    let tempRow = new Row(
      data[i]["Data"],
      data[i]["Etapa pâlniei"],
      data[i]["Nr"],
      data[i]["Produs"],
      data[i]["Gravare"],
      data[i]["Comanda"],
      data[i]["Livrare"],
      data[i]["Cont"],
      data[i]["Nume"],
      data[i]["Telefon"],
      data[i]["Raion"],
      data[i]["Sat"],
      data[i]["Cod postal"],
      data[i]["Adresa"],
      data[i]["Suma"],
      data[i]["Achitare"],
      data[i]["Remarca"],
      data[i]["Track"],
      data[i]["Site"],
      data[i]["Mesaj"],
      data[i]["Suma de incasat"]
    );
    rows.push(tempRow);
  }
}
function productSet() {
  rows.forEach((row) => {
    let tempRow = new Product(row.number, row.color, row.engraving);
    products.push(tempRow);
  });
}
function orderSet(orders, customers) {
  let orderIndex = [];
  rows.forEach((row) => {
    if (row.account != undefined && row.account != undefined)
      orderIndex.push(row.number - 1);
  });
  for (let i = 0; i < orderIndex.length; i++) {
    let row = rows[orderIndex[i]];
    if (row.date == "") row.date = orders[orders.length - 1].date;
    if (customers.length == 0) index = 1;
    else index = customers[customers.length - 1].id + 1;
    let tempCustomer = new Customer(
      row.account,
      row.name,
      row.phone,
      row.region,
      row.city,
      row.postCode,
      row.adress,
      row.date,
      index
    );
    if (preventCustomerDuplicate(customers, tempCustomer).status) {
      customers.push(tempCustomer);
    } else
      tempCustomer = new Customer(
        preventCustomerDuplicate(customers, tempCustomer).actual.account,
        preventCustomerDuplicate(customers, tempCustomer).actual.name,
        preventCustomerDuplicate(customers, tempCustomer).actual.phone,
        preventCustomerDuplicate(customers, tempCustomer).actual.region,
        preventCustomerDuplicate(customers, tempCustomer).actual.city,
        preventCustomerDuplicate(customers, tempCustomer).actual.postCode,
        preventCustomerDuplicate(customers, tempCustomer).actual.adress,
        preventCustomerDuplicate(customers, tempCustomer).actual.date,
        preventCustomerDuplicate(customers, tempCustomer).actual.id,
        preventCustomerDuplicate(customers, tempCustomer).actual.orders,
        preventCustomerDuplicate(customers, tempCustomer).actual.ltv
      );
    let tempOrder = new Order(
      tempCustomer,
      [],
      row.orderNumber,
      row.date,
      row.status,
      row.sum,
      row.deliveryMethod,
      row.payingMethod,
      row.track,
      row.remark,
      row.site,
      row.message,
      row.realSum
    );
    let rightLimit;
    if (i == orderIndex.length - 1) rightLimit = rows.length;
    else rightLimit = orderIndex[i + 1];
    for (let j = orderIndex[i]; j < rightLimit; j++) {
      let tempProduct = new Product(
        rows[j].number,
        rows[j].color,
        rows[j].engraving
      );
      tempOrder.productSet.push(tempProduct);
    }
    if (preventOrderDuplicate(orders, tempOrder)) {
      orders.push(tempOrder);
      let circular = new Circular(tempOrder);
      tempCustomer.orders.push(circular);
      tempCustomer.ltv += tempOrder.sum;
    }
  }
}

module.exports.ordersData = async function accesSpreadsheet(orders, customers) {
  const doc = new GoogleSpreadsheet(
    "1Y372EhEV-6AQl70kiiBjsmfi-G5PTwWZLzMEZkjjK70"
  );
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  await doc.loadInfo();

  const sheet = await doc.sheetsByIndex[0];
  const data = await sheet.getRows();

  rowSet(data);
  productSet();
  orderSet(orders, customers);
};
