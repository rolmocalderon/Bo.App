<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from 'vue-chartjs/legacy';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
ChartJS.defaults.color = "#fff";
ChartJS.defaults.font.size = "11px";

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    },
    values: {
        type: Object,
        default: () => {}
    }
  },
  data() {
    return {
      chartData: {
        labels: this.values.labels,
        datasets: [ { 
            label: 'Data',
            data: this.values.data,
            backgroundColor: ['#93b6ef'],
            color: '#fff'
        } ]
      },
      chartOptions: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true
            }
        }
      }
    }
  },
  watch: {
    values: function(val){
        this.chartData.datasets.data = val.data;
        this.chartData.labels = val.labels;
    }
  }
}
</script>