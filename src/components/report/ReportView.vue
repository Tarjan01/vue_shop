<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!-- 2. 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 750px;height: 400px;">
        <!--基于准备好的dom,初始化echarts实例-->
        var myChart = echarts.init(document.getElementById('main'));
      </div>
    </el-card>
  </div>
</template>

<script>
// 1. 导入 echarts
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {

  },
  async mounted () {
    // 3.此时页面上的元素已经被渲染完毕了 基于准备好的dom,初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    // 4. 准备数据和配置项
    // 指定图表的配置项和数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取数据失败')

    _.merge(res.data, this.options)
    // 5.展示数据
    myChart.setOption(res.data)
  },
  methods: {

  }
}
</script>

<style lang="less" scoped></style>
