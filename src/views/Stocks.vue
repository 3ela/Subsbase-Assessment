<template>
  <div class="home">
    {{allData}}
      asdas
    <v-btn
      elevation="2"
      @click='addItem'
    >
      addItem
    </v-btn>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    
  },

  data() {
    return {
      allData: []
    }
  },

  methods: {
    addItem() {
      this.allData.push('done')
    }
  }
}
</script>
