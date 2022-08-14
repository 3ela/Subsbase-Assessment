<template>
  <div>
    <v-card class="pa-2">
      <v-row justify='center' align='center'>
        <v-col 
          align="center"
          justify="start"
        >
          <h1 :class='determineCloseColor()' class="text-h3">  
            {{item.details.close != null ? item.details.close : 0}}    
          </h1>
        </v-col>
        <v-col
          align="start"
          justify="end"
        >
          <div
            v-for='(value, key) in item.details'
            :key='key'
          >
            {{key}} : {{value ? value : 0}} 
          </div>
        </v-col>
      </v-row>

      <v-row 
        v-if="item.details.close != null && isStocksRoute"
        justify='center' 
        align='center'
      >
        <v-col class="ms-5 mb-4">
          <h4 class="text-h4 ml-3"> {{ item.symbol ? item.symbol.toUpperCase() : ' - ' }} </h4>
        </v-col>
        <v-col align='end'>
          <v-btn
            class="ma-2"
            fab
            x-small
            color='error'
            @click="removeItem(cardIndex)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row 
        v-else-if="item.details.close != null && !isStocksRoute"
        justify='center' 
        align='center'
      >
        <v-col class="mb-4">
          <span class="text-h5 ml-3"> {{ item.from_symbol ? item.from_symbol.toUpperCase() : ' - ' }}  {{' / '}} </span>  
          <span class="text-h5"> {{ item.to_symbol ? item.to_symbol.toUpperCase() : ' - ' }} </span>
        </v-col>
        <v-col align='end'>
          <v-btn
            class="ma-2"
            fab
            x-small
            color='error'
            @click="removeItem(cardIndex)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-else-if="item.details.close == null && isStocksRoute">
        <v-col>
          <v-text-field
            label="Stocks Symbol"
            v-model='stockSymbol'
            @change='getStocks'
          ></v-text-field>
        </v-col>
        <v-col align='center' justify='end' class="mt-auto mb-2" cols='2'>
          <v-btn
            fab
            x-small
            color='error'
            @click="removeItem(cardIndex)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else-if="item.details.close == null && !isStocksRoute">
        <v-col>
          <v-text-field
            label="Currency from"
            counter='3'
            v-model='currFrom'
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            counter='3'
            label="Currency to"
            v-model='currto'
            :disabled='currFrom.length < 3'
            @input='getFX'
          ></v-text-field>
        </v-col>
        <v-col align='center' justify='end' class="mt-auto mb-2" cols='2'>
          <v-btn
            fab
            x-small
            color='error'
            @click="removeItem(cardIndex)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-overlay :value="loading" :absolute='true'>
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </v-card>

  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  props: ['item', 'isStocksRoute', 'addItem', 'removeItem', 'cardIndex'],
  data() {
    return {
      stockSymbol: '',
      currFrom: '',
      currto: '',
      loading: false,
    }
  },
  mounted() {
    // console.log("mounted => this.item", this.item)
  },

  methods: {
    ...mapActions(['getFXData', 'getStockData']),
    determineCloseColor() {
      if(this.item.details.close > this.item.details.open) {
        return 'green--text accent-3'
      }else if(this.item.details.close < this.item.details.open){
        return 'red--text accent-3'
      }else {
        return ''
      }
    },
    getStocks() {
      this.loading = true;
      this.getStockData({ symbol: this.stockSymbol })
        .then(res => {
          this.addItem({...this.stockCard}, this.cardIndex)
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          
        })
    },
    getFX() {
      if(this.currto.length == 3) {
        this.loading = true;
        this.getFXData({ 
          from_symbol: this.currFrom,
          to_symbol: this.currto,
        })
          .then(res => {
            this.addItem({...this.fxCard}, this.cardIndex)
            this.loading = false;
          }).catch(err => {
            console.log("getFX => err", err)
            this.loading = false;
            
          })
      }
    },
  },
  computed: {
    ...mapGetters(['stockCard', 'fxCard', 'stockSeries', 'fxSeries']),

  }
}
</script>