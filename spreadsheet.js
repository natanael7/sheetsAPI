class Order {
  constructor(
    customer,
    productSet,
    number,
    date,
    status,
    sum,
    deliveryMethod,
    payingMethod,
    track,
    remark,
    site,
    message,
    realSum
  ) {
    this.customer = customer;
    this.productSet = productSet;
    this.number = parseInt(number);
    this.date = date;
    this.status = status;
    this.sum = parseInt(sum);
    this.payingMethod = payingMethod;
    this.deliveryMethod = deliveryMethod;
    this.track = track;
    this.remark = remark;
    this.site = site;
    this.message = message;
    this.realSum = parseInt(realSum);
  }
}
class Customer {
  constructor(account, name, phone, region, sat, postCode, adress, id, orders) {
    this.account = account;
    this.name = name;
    this.phone = phone;
    this.region = region;
    this.sat = sat;
    this.postCode = postCode;
    this.adress = adress;
    this.id = id;
    if (orders != undefined)
      this.orders = orders
    else 
      this.orders= []
  }
}
class Product {
  constructor(nr, color, engraving) {
    this.nr = parseInt(nr);
    this.color = color;
    this.engraving = engraving;
  }
}
class Row {
  constructor(
    date,
    status,
    number,
    color,
    engraving,
    orderNumber,
    deliveryMethod,
    account,
    name,
    phone,
    region,
    sat,
    postCode,
    adress,
    sum,
    payingMethod,
    remark,
    track,
    site,
    message,
    realSum
  ) {
    this.date = date;
    this.status = status;
    this.number = number;
    this.color = color;
    this.engraving = engraving;
    this.orderNumber = orderNumber;
    this.deliveryMethod = deliveryMethod;
    this.account = account;
    this.name = name;
    this.phone = phone;
    (this.region = region), (this.sat = sat), (this.postCode = postCode);
    this.adress = adress;
    this.sum = sum;
    this.payingMethod = payingMethod;
    this.remark = remark;
    this.track = track;
    this.site = site;
    this.message = message;
    this.realSum = realSum;
  }
}
class Circular {
  constructor(
    order
  ) {
    this.customer = "[Circular]"
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
const { promisify } = require("util");
const creds = require("./client_secret.json");

function preventCustomerDuplicate(customers, search) {
  for (let i = 0; i < customers.length; i++)
    if (customers[i].account == search.account)
      return { status: false, actual: customers[i] };
  return { status: true };
}
function preventOrderDuplicate(orders, search) {
  for (let i = 0; i < orders.length; i++)
    if (orders[i].number == search.number)
      return false
  return true
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
    if (customers.length == 0) index = 1;
    else index = customers[customers.length - 1].id + 1;
    let tempCustomer = new Customer(
      row.account,
      row.name,
      row.phone,
      row.region,
      row.sat,
      row.postCode,
      row.adress,
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
        preventCustomerDuplicate(customers, tempCustomer).actual.sat,
        preventCustomerDuplicate(customers, tempCustomer).actual.postCode,
        preventCustomerDuplicate(customers, tempCustomer).actual.adress,
        preventCustomerDuplicate(customers, tempCustomer).actual.id,
        preventCustomerDuplicate(customers, tempCustomer).actual.orders
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
    if (preventOrderDuplicate(orders,tempOrder)){
      orders.push(tempOrder);
      let circular = new Circular(tempOrder);
      tempCustomer.orders.push(circular);
    }
  }
}

module.exports.ordersData = async function accesSpreadsheet(orders, customers) {
  const doc = new GoogleSpreadsheet(
    "1Qlmc-tfrvQ1sTO4UL2NZmVFlUbQII8qaTgQdpECjNf0"
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
