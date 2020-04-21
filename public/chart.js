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
          label: "Number of orders",
          data: chartData.count,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        
        {
          fill: false,
          label: "Medium check of orders",
          data: chartData.average,
          borderColor: "rgba(2, 180, 13, 1)",
          borderWidth: 1,
        }
      ],
    },
  });
}
async function getData() {
  const response = await fetch("/ordersByMonth");
  await response.json().then((data) => {
    data.forEach((element) => {
      for (const property in element) {
        chartData[property].push(element[property]);
      }
    });
  });
}
chartIt();
