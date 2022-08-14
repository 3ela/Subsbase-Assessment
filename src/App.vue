<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list
        nav
      >
        <v-list-item-group>
          <v-list-item 
            v-for='tab in drawerTabs'
            :key='tab.name'
            :to='{ name: tab.route }'
          >
            <v-list-item-icon>
              <v-icon>mdi-{{tab.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ tab.label }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title></v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      drawer: null,
      drawerTabs: [
        { name: 'stocks', label: 'Stocks', icon: 'trending-up', route: 'Stocks'},
        { name: 'fx', label: 'Foreign exchange', icon: 'cash-multiple', route: 'FX'},
      ]
    }),
    mounted() {
      this.getCurrUser()
        .then(res => {
          this.$router.replace({
            name: this.$route.name,
            query: {
              user: res.id
            }
          }).catch((err) => {
            // console.log(err)
          })
        })
    },
    watch: {
      $route: function() {
        this.getCurrUser()
          .then(res => {
            this.$router.replace({
              name: this.$route.name,
              query: {
                user: res.id
              }
            }).catch((err) => {
              // console.log(err)
            })
          })
      }
    },
  }
</script>