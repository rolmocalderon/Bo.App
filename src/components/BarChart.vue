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
import { Bar } from 'vue-chartjs/legacy'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
ChartJS.defaults.color = "#fff";

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
      type: Array,
      default: () => []
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
        datasets: [
          {
            label: 'Data',
            backgroundColor: '#93b6ef',
            data: this.values.data,
            dates: this.values.dates
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: function(context){
                        return [`Data: ${context.formattedValue} Kg`, `Fecha: ${context.dataset.dates[context.dataIndex]}`];
                    },
                    title: function(context) {
                        return context[0].label.replace(',',' ');
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        }
      }
    }
  },
  watch: {
    values: function(val){
        this.chartData.datasets.data = val.data;
        this.chartData.labels = val.labels;
        this.chartData.dates = val.dates;
        this
    }
  }
}
</script>
