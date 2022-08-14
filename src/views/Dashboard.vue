<template>
  <div class="dashboard pa-3">
    <v-row>
      <v-col 
        v-show='isStocksRoute'
        cols='4'
        v-for='(item, ind) in stockItems'
        :key='ind'
      >
        <DataCard 
          :cardIndex='ind'
          :item='item'
          :addItem='addItem'
          :removeItem='removeItem'
          :isStocksRoute='isStocksRoute'
        />
      </v-col>
      <v-col 
        v-show='!isStocksRoute'
        cols='4'
        v-for='(item, ind) in fxItems'
        :key='(ind+1)*100'
      >
        <DataCard 
          :cardIndex='ind'
          :item='item'
          :addItem='addItem'
          :removeItem='removeItem'
          :isStocksRoute='isStocksRoute'
        />
      </v-col>
      <v-col
        
      >
        <v-btn
          elevation="2"
          @click='initiateItem'
          color='success'
        >
          Add Item
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="my-5"/>
    <LineChart class="chart-container" :isStocksRoute='isStocksRoute'/>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar
      v-model="snackbar"
      :multi-line="true"
    >
      {{snackbarMsg}}
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
import DataCard from '@/components/DataCard.vue';
import LineChart from '@/components/LineChart.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'FX',
  components: {
    DataCard,
    LineChart
  },

  data() {
    return {
      stockItems: [],
      fxItems: [],
      defaultCard: {
        details: {
          close: null,
          open: null
        }
      },
      defaultStock: 'msft',
      defaultFX: {
        from_symbol: 'egp',
        to_symbol: 'aed',
      },
      loading: false,
      
    }
  },
  created() {
    window.addEventListener("unload", this.leaveHandler)
  },
  mounted() {
    this.getCurrUser()
      .then(res => {
        this.initiateUserState(res);
      }).catch(err => {
        this.inititateDefaultState()
      })
  },
  destroyed() {
    window.removeEventListener('unload', this.leaveHandler);
  },
  methods: {
    ...mapActions(['getStockData', 'getFXData']),
    ...mapMutations(['removeSeries']),
    initiateItem() {
      this.isStocksRoute ? this.stockItems.push(this.defaultCard) : this.fxItems.push(this.defaultCard);
    },  
    addItem(item, index, type) {
      if(type) {
        type == 'stock' 
          ? this.stockItems[index] =  {...item}
          : this.fxItems[index] =  {...item};
      }else {
        this.isStocksRoute 
          ? this.stockItems[index] =  {...item}
          : this.fxItems[index] =  {...item};
          this.$forceUpdate();
      }
    },
    removeItem(index) {
      if(this.isStocksRoute) {
        this.stockItems.splice(index, 1);
        this.removeSeries({
          type: 'stock',
          index
        })
      }else {
        this.fxItems.splice(index, 1);
        this.removeSeries({
          type: 'fx',
          index
        })
      }
      this.$forceUpdate();
    },
    createFXPromise(data, index) {
      let fxPromise = new Promise((resolve, reject) => {
        this.getFXData({...data})
          .then(res => {
            this.addItem({...this.fxCard}, index || 0, 'fx')
            resolve(true)
          }).catch(err => {
            reject(err)
          })
      });
      return fxPromise;
    },
    createStockPromise(data, index) {
      let stockPromise = new Promise((resolve, reject) => {
        this.getStockData({symbol: data})
          .then(res => {
            this.addItem({...this.stockCard}, index || 0, 'stock')
            resolve(true)
          }).catch(err => {
            reject(err)
          })
      });
      return stockPromise;
    },
    inititateDefaultState() {
      this.loading = true;
      Promise.all([
        this.createFXPromise(this.defaultFX), this.createStockPromise(this.defaultStock)
      ]).then((values) => {
        this.loading = false
      }).catch(err => {
        this.getCurrUser() 
          .then(res => {
            this.stockItems = res.stockItems;
            this.fxItems = res.fxItems;
          })
        this.loading = false
      }) 
    },
    initiateUserState(userData) {
      this.loading = true;
      let stockPromises = [];
      let fxPromises = [];

      userData.stockItems.forEach((item, itemInd) => {
        stockPromises.push(this.createStockPromise(item.symbol, itemInd));
      });
      userData.fxItems.forEach((item, itemInd) => {
        fxPromises.push(
          this.createFXPromise({from_symbol: item.from_symbol, to_symbol: item.to_symbol}, itemInd)
        );
      });
      Promise.all([...stockPromises, ...fxPromises]).then(values => {
        this.loading = false
      }).catch(err => {
        this.getCurrUser() 
          .then(res => {
            this.stockItems = res.stockItems;
            this.fxItems = res.fxItems;
          })
        this.loading = false
      }) 
    },
    leaveHandler(event) {
      if(this.fxItems.length == 0 && this.stockItems.length == 0) {
      }else {
        this.setCurrUser({fxItems: this.fxItems, stockItems: this.stockItems});
      }
      
    }
  },

  computed: {
    ...mapGetters(['stockCard', 'fxCard', 'snackbarMsg', 'snackbar']),

    isStocksRoute() {
      return this.$route.name == 'Stocks'
    },
    // currStockItems() {
    //   return this.stockItems;
    // },
    // currFXItems() {
    //   return this.fxItems;
    // }
  }
}
</script>

<style scoped>
.chart-container {
  height: 400px;
}
</style>