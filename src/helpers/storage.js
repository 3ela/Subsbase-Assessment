import { nanoid } from 'nanoid'
// import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      appKey: 'subs',
      currUserId: null,
    }
  },
  methods: {
    getCurrUser() {
      return new Promise((resolve, reject) => {
        if(localStorage.key(this.appKey)) {
          let currUser = JSON.parse(localStorage.getItem(this.appKey));
          this.currUserId = currUser.id;
          resolve(currUser);
        } else {
          reject(false)
        }
      })
    },
    setCurrUser(items) {
      items.fxItems.forEach((item, itemInd) => {
        if(item.details.close == null) {
          items.fxItems.splice(itemInd, 1)
        }
      })
      items.stockItems.forEach((item, itemInd) => {
        if(item.details.close == null) {
          items.stockItems.splice(itemInd, 1)
        }
      })
      let user = {
        id: this.currUserId == null ? nanoid() : this.currUserId,
        stockItems: items.stockItems,
        fxItems: items.fxItems
      }
      let stringifiedUser = JSON.stringify(user);
      localStorage.setItem(this.appKey, stringifiedUser);
    }
  },

  // computed: {
  //   ...mapGetters([]),
  // }
}