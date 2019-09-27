<template>
  <div>
    <div v-for="(data,index) in item" :key="index" class="container qq mt-3 mb-3">
      <div v-for="(itemData,idx) in data" :key="idx" class="d-flex center">
        <div class="flex-fill w-50 border border-info">{{idx}}:</div>
        <div class="flex-fill w-50 border border-info">{{itemData}}</div>
      </div>
    </div>
    <ve-line :data="CO2Data"></ve-line>
    <ve-line :data="TemperatureData"></ve-line>
    <ve-line :data="HumidityData"></ve-line>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
      CO2Data: {
        columns: ["date", "CO2"],
        rows: [
          { date: "2019-01-23T03:06:00.294", CO2: 1393 },
          { date: "2019-01-24T03:06:00.294", CO2: 3530 },
          { date: "2019-01-25T03:06:00.294", CO2: 2923 },
          { date: "2019-01-26T03:06:00.294", CO2: 1723 },
          { date: "2019-01-27T03:06:00.294", CO2: 3792 },
          { date: "2019-01-28T03:06:00.294", CO2: 4593 }
        ]
      },
      TemperatureData: {
        columns: ["date", "Temperature"],
        rows: [
          { date: "2019-01-23T03:06:00.294", Temperature: 1093 },
          { date: "2019-01-24T03:06:00.294", Temperature: 3230 },
          { date: "2019-01-25T03:06:00.294", Temperature: 2623 },
          { date: "2019-01-26T03:06:00.294", Temperature: 1423 },
          { date: "2019-01-27T03:06:00.294", Temperature: 3492 },
          { date: "2019-01-28T03:06:00.294", Temperature: 4293 }
        ]
      },
      HumidityData: {
        columns: ["date", "Humidity"],
        rows: [
          { date: "2019-01-23T03:06:00.294", Humidity: 0.32 },
          { date: "2019-01-24T03:06:00.294", Humidity: 0.26 },
          { date: "2019-01-25T03:06:00.294", Humidity: 0.76 },
          { date: "2019-01-26T03:06:00.294", Humidity: 0.49 },
          { date: "2019-01-27T03:06:00.294", Humidity: 0.323 },
          { date: "2019-01-28T03:06:00.294", Humidity: 0.78 }
        ]
      }
    };
  },
  methods: {
    getSocket() {
      const vm = this;
      localStorage.getItem("event");
      localStorage.getItem("token");

      let obj = JSON.parse(localStorage.event);
      for (let i in obj) {
        let linshiObj = {};
        linshiObj[i] = obj[i];
        vm.item.push(linshiObj);
      }

      console.log(JSON.parse(localStorage.event));
      console.log(JSON.parse(localStorage.token));
      let socketMsg1 = {
        action: "authenticate",
        token: localStorage.token.accessToken
      };
      let socketMsg2 = {
        action: "notification/subscribe",
        deviceId: localStorage.event.id,
        names: ["measurements"]
      };

      const socketUrl = "wss://earth.comismart.com/api/websocket";
      const websocket = new WebSocket(socketUrl);
      websocket.onopen = function() {
        onOpen();
      };
      function onOpen() {
        doSend(JSON.stringify(socketMsg1));
        doSend(JSON.stringify(socketMsg2));
      }
      function doSend(message) {
        websocket.send(message);
      }
      websocket.onmessage = function(e) {
        var msg = JSON.parse(e.data);
        console.log(msg);
        vm.makeChart(
          e.data.timestamp,
          e.data.parameters.CO2.value,
          e.data.parameters.Temperature.value,
          e.data.parameters.Humidity.value
        );
      };
    },
    makeChart(time, C, T, H) {
      this.CO2Data.rows.push({ date: time, CO2: C });
      this.TemperatureData.rows.push({ date: time, Temperature: T });
      this.HumidityData.rows.push({ date: time, Humidity: H });
    }
  },
  created() {
    this.getSocket();
  }
};
</script>
