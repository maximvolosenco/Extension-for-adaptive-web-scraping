<template>
  <div>
    <!-- <h2>Selector</h2>
    <el-form :inline="true">
      <el-form-item label="Name">
        <el-input type="text" v-model="component_name"></el-input>
      </el-form-item>
    </el-form> -->
    <el-button type="primary" @click="start">start crawling</el-button>
  </div>
</template>

<script>
export default {
  name: 'popupView',
  data () {
    return {
      component_name: '',
    }
  },
  methods: {
    start() {
      var component_name = this.component_name
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var activeTab = tabs[0]
        chrome.tabs.sendMessage(activeTab.id, {command: 'Start', 'name': component_name})
          })
    }
  }
}

</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 500px;
}
</style>
