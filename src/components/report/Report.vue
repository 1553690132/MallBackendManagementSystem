<template>
  <div>
    <breadcrumb title1="数据统计" title2="数据报表"></breadcrumb>

    <el-card>
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Report",
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },

  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    const { data: res } = await this.$http.get("/reports/type/1");
    if (res.meta.status !== 200) return this.$message.error("获取数据失败！");
    const options = { ...this.options, ...res.data };
    myChart.setOption(options);
  },
};
</script>

<style lang="less" scoped>
#main {
  width: 800px;
  height: 400px;
}
</style>