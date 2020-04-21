const { GoogleSpreadsheet } = require("google-spreadsheet");
const {Order, Customer, Product, Row, Circular} = require('./classes.js') 

const creds = require("./client_secret.json");

let rows = [];
let products = [];


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
    let tempRow = new Row(data[i]);
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
