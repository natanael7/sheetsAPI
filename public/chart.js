function datasetsGenerator(dataObj) {
  let res = []
  for (const property in dataObj) { 
    let temp
  }
}
let chartData = { days: [], count: [], sum: [], average:[] };
async function chartIt() {
  await getData();
  let ctx = document.getElementById("myChart").getContext("2d");
  let myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.days,
      datasets: [
        {
          fill: false,
          label: "Number of orders by day",
          data: chartData.count,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          fill: false,
          label: "Sum of orders by day",
          data: chartData.sum,
          borderColor: "rgba(2, 99, 132, 1)",
          borderWidth: 1,
        }
      ],
    },
  });
}
async function getData() {
  const response = await fetch("/ordersByDay");
  await response.json().then((data) => {
    data.forEach((element) => {
      for (const property in element) {
        chartData[property].push(element[property]);
      }
    });
  });
}
chartIt();
