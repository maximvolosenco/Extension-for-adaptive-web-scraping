<template>
  <div>
    <h2>Adaptive</h2>    
  </div>
</template>

<script>
export default {
  name: 'popupView',
  data () {
    return {
      name: '',
      dedup: false
    }
  },
  methods: {
    start() {
      var name = this.name
      var dedup = this.dedup
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var activeTab = tabs[0]
        chrome.tabs.sendMessage(activeTab.id, {command: 'trigger', 'name': name, 'dedup': dedup})
          })
    }
  }
}

</script>
