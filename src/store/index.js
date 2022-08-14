import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

Axios.defaults.baseURL = 'https://www.alphavantage.co';
// let apikey = 'AH6ACPDKFZ83PE9Y';
let apikey = 'X2WPX0YMBUAOLNTI';

Axios.interceptors.request.use(function (config) {
  config.params = {
    ...config.params,
    apikey
  }
  return config;
}, function (error) {
  console.log('error', error)
  return Promise.reject(error);
});

export default new Vuex.Store({
  state: {
    stockCard: [],
    fxCard: [],
    stockSeries: [],
    fxSeries: [],
    stockLabels: [],
    fxLabels: [],
    snackbar: false,
    snackbarMsg: ''
  },
  getters: {
    stockCard: (state) => state.stockCard,
    fxCard: (state) => state.fxCard,
    stockSeries: (state) => state.stockSeries,
    stockLabels: (state) => state.stockLabels,
    fxSeries: (state) => state.fxSeries,
    fxLabels: (state) => state.fxLabels,
    snackbar: (state) => state.snackbar,
    snackbarMsg: (state) => state.snackbarMsg,
  },  
  mutations: {
    addStockCard(state, payload) {
      let seriesObj = payload['Time Series (Daily)'];
      let detailsHolder = {};

      for (const [key, value] of Object.entries(Object.values(seriesObj)[0])) {
        detailsHolder[key.split(' ')[1]] = parseFloat(value).toFixed(1);
      }
      state.stockCard = {
        symbol: payload['Meta Data']['2. Symbol'],
        details: {
          ...detailsHolder,
        }
      }
    },
    addStockSeries(state, payload) {
      let currSeries = [];
      for (let i = 0; i <= 10; i++) {
        currSeries.push(Object.values(payload.series)[i]['4. close'])
      }
      let randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
      state.stockSeries.push({
        label: payload.symbol,
        backgroundColor: randomColor,
        borderColor: randomColor,
        data: currSeries
      })
      state.stockLabels = [...Object.keys(payload.series)]
      state.stockLabels.splice(11)
    },
    addFXCard(state, payload) {
      let seriesObj = payload['Time Series FX (Daily)'];
      let detailsHolder = {};

      for (const [key, value] of Object.entries(Object.values(seriesObj)[0])) {
        detailsHolder[key.split(' ')[1]] = value;
      }
      state.fxCard = {
        from_symbol: payload['Meta Data']['2. From Symbol'],
        to_symbol: payload['Meta Data']['3. To Symbol'],
        details: {
          ...detailsHolder,
        }
      }
    },
    addFXSeries(state, payload) {
      let currSeries = []
      for (let i = 0; i <= 10; i++) {
        currSeries.push(Object.values(payload.series)[i]['4. close'])
      }
      let randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
      state.fxSeries.push({
        label: payload.symbol,
        backgroundColor: randomColor,
        borderColor: randomColor,
        data: currSeries
      })
      state.fxLabels = [...Object.keys(payload.series)]
      state.fxLabels.splice(11)
    },
    removeSeries(state, payload) {
      if(payload.type == 'stock') {
        state.stockSeries.splice(payload.index, 1)
      }else {
        state.fxSeries.splice(payload.index, 1)
      }
    },
    openSnakbar(state, payload) {
      state.snackbar = true;
      state.snackbarMsg = payload;
    }
  },
  actions: {
    getStockData({commit}, payload) {
      return new Promise((resolve, reject) => {
        Axios.get('/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol: payload.symbol,
            // interval: '5min'
          }
        }).then(res => {
          if(res.data['Meta Data']) {
            commit('addStockCard', res.data);
            commit('addStockSeries', 
              { 
                series: res.data['Time Series (Daily)'],
                symbol: res.data['Meta Data']['2. Symbol']
              });
            resolve(res)
          }else {
            commit('openSnakbar', res.data?.Note || res.data['Error Message'])
            reject(res)
          }
        }).catch(err => {
          commit('openSnakbar', err.msg)
          reject(err)
        })
      })
    },
    getFXData({commit}, payload) {
      return new Promise((resolve, reject) => {
        Axios.get('/query', {
          params: {
            function: 'FX_DAILY',
            from_symbol: payload.from_symbol,
            to_symbol: payload.to_symbol,
            // interval: '5min'
          }
        }).then(res => {
          if(res.data['Meta Data']) {
            commit('addFXCard', res.data);
            commit('addFXSeries', {
              series: res.data['Time Series FX (Daily)'],
              symbol: res.data['Meta Data']['2. From Symbol'] + '/' +  res.data['Meta Data']['3. To Symbol']
            });
            resolve(res)
          }else {
            commit('openSnakbar', res.data?.Note || res.data['Error Message'])
            reject(res)
          }
        }).catch(err => {
          commit('openSnakbar', err.msg)
          reject(err)
        })
      })
    },
  },
  modules: {
  }
})
