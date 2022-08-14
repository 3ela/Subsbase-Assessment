<template>
  <v-row>
    <v-col>
      <v-card class="pa-4">
        <lineChart
        :chart-options="chartOptions"
        :chart-data="chartData"
        :height='chartHeight'
      />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex'
import { Line as lineChart } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Plugin
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)

export default {
  components: {
    lineChart
  },
  props: ['isStocksRoute'],
  data() {
    return {
      type: 'line',
      chartHeight: 500,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        plugins: {
          legend: {
            position: 'top',
          },
        }
      },
    }
  },

  methods: {
    
  },

  computed: {
    ...mapGetters(['stockSeries', 'fxSeries', 'fxLabels', 'stockLabels']),
    chartData() {
      if(this.isStocksRoute) {
        return {
          labels: this.stockLabels,
          datasets: this.stockSeries
        }
      }else {
        return {
          labels: this.fxLabels,
          datasets: this.fxSeries
        }
      }
    }
  }
}
</script>

