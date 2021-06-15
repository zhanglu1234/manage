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
        });
      await this.$http
        .get("/driverInfo/selectWeekCountDriverInfo", {
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
            this.driverCountList[i] = res.data[i].count;
          }
        });
      await this.$http
        .get("/clientInfo/selectWeekCountClientInfo", {
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
            this.clientCountList[i] = res.data[i].count;
          }
        });
      await this.$http
        .get("/businessLogin/selectWeekBusinessInfo", {
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
            this.businessCountList[i] = res.data[i].count;
          }
        });
      await this.$http
        .get("/order/selectWeekCountOrderInfo", {
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
            this.orderCountList[i] = res.data[i].count;
          }
        });

      option = {
        title: {
          text: "最近一周出/入园区人员数据展示",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["申请数目", "订单数目", "客户人数", "司机人数", "管理员人数"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",

          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "申请数目",
            type: "line",
            stack: "总量",
            data: [
              this.countList[0],
              this.countList[1],
              this.countList[2],
              this.countList[3],
              this.countList[4],
              this.countList[5],
              this.countList[6],
            ],
          },
          {
            name: "订单数目",
            type: "line",
            stack: "总量",
            data: [
              this.orderCountList[6],
              this.orderCountList[5],
              this.orderCountList[4],
              this.orderCountList[3],
              this.orderCountList[2],
              this.orderCountList[1],
              this.orderCountList[0],
            ],
          },
          {
            name: "客户人数",
            type: "line",
            stack: "总量",
            data: [
              this.clientCountList[0],
              this.clientCountList[1],
              this.clientCountList[2],
              this.clientCountList[3],
              this.clientCountList[4],
              this.clientCountList[5],
              this.clientCountList[6],
            ],
          },
          {
            name: "司机人数",
            type: "line",
            stack: "总量",
            data: [
              this.driverCountList[0],
              this.driverCountList[1],
              this.driverCountList[2],
              this.driverCountList[3],
              this.driverCountList[4],
              this.driverCountList[5],
              this.driverCountList[6],
            ],
          },
          {
            name: "管理员人数",
            type: "line",
            stack: "总量",
            data: [
              this.businessCountList[6],
              this.businessCountList[5],
              this.businessCountList[4],
              this.businessCountList[3],
              this.businessCountList[2],
              this.businessCountList[1],
              this.businessCountList[0],
            ],
          },
        ],
      };
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