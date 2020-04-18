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
    this.number = number;
    this.date = date;
    this.status = status;
    this.sum = sum;
    this.payingMethod = payingMethod;
    this.deliveryMethod = deliveryMethod;
    this.track = track;
    this.remark = remark;
    this.site = site;
    this.message = message;
    this.realSum = realSum;
  }
}
class Customer {
  constructor(account, name, phone, raion, sat, postCode, adress) {
    this.account = account;
    this.name = name;
    this.phone = phone;
    this.raion = raion;
    this.sat = sat;
    this.postCode = postCode;
    this.adress = adress;
  }
}
class Product {
  constructor(nr, color, engraving) {
    this.nr = nr;
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
    raion,
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
    this.raion = raion;
    this.sat = sat;
    this.postCode = postCode;
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
