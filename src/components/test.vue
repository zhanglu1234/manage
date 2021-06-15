<template>
  <div id="myChart"></div>
</template>

<script>
export default {
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      countList: [],
      driverCountList: [],
      clientCountList: [],
      businessCountList: [],
      orderCountList: [],
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    async drawLine() {
      var chartDom = document.getElementById("myChart");
      var myChart = this.$echarts.init(chartDom);
      var option;
      await this.$http
        .get("/applyInfo/selectWeekCountApplyInfo", {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        })
        .then((Response) => {
          var res = Response.data;
          console.log("获取一周数据");
          console.log(res.data);

          for (var i = 0; i < res.data.length; i++) {
            console.log(res.data[i].count);
            this.countList[i] = res.data[i].count;
          }
          console.log("展示");

          console.log(this.countList);
        });
      setTimeout(function (data) {
        console.log("展示jjjjj");
        console.log(data);
        option = {
          legend: {},
          tooltip: {
            trigger: "axis",
            showContent: false,
          },
          dataset: {
            source: [
              [
                "product",
                "2012",
                "2013",
                "2014",
                "2015",
                "2016",
                "2017",
                "2018",
              ],
              [
                "Milk Tea",
                this.countList,
                this.countList[5],
                this.countList[4],
                this.countList[3],
                this.countList[2],
                this.countList[1],
                this.countList[0],
              ],
              ["Matcha Latte", 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
              ["Matcha Latte", 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
              ["Cheese Cocoa", 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
              ["Walnut Brownie", 25.2, 37.1, 41.2, 18, 33.9, 49.1],
            ],
          },
          xAxis: { type: "category" },
          yAxis: { gridIndex: 0 },
          grid: { top: "55%" },
          series: [
            {
              type: "line",
              smooth: true,
              seriesLayoutBy: "row",
              emphasis: { focus: "series" },
            },
            {
              type: "line",
              smooth: true,
              seriesLayoutBy: "row",
              emphasis: { focus: "series" },
            },
            {
              type: "line",
              smooth: true,
              seriesLayoutBy: "row",
              emphasis: { focus: "series" },
            },
            {
              type: "line",
              smooth: true,
              seriesLayoutBy: "row",
              emphasis: { focus: "series" },
            },
            {
              type: "pie",
              id: "pie",
              radius: "30%",
              center: ["50%", "25%"],
              emphasis: { focus: "data" },
              label: {
                formatter: "{b}: {@2012} ({d}%)",
              },
              encode: {
                itemName: "product",
                value: "2012",
                tooltip: "2012",
              },
            },
          ],
        };

        myChart.on("updateAxisPointer", function (event) {
          var xAxisInfo = event.axesInfo[0];
          if (xAxisInfo) {
            var dimension = xAxisInfo.value + 1;
            myChart.setOption({
              series: {
                id: "pie",
                label: {
                  formatter: "{b}: {@[" + dimension + "]} ({d}%)",
                },
                encode: {
                  value: dimension,
                  tooltip: dimension,
                },
              },
            });
          }
        });

        myChart.setOption(option);
      });

      (await option) && myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
#myChart {
  width: 80%;
  height: 90%;
  /* -webkit-tap-highlight-color: transparent; */
  /* user-select: none; */
  /* position: relative; */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>