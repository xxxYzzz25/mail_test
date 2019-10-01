<template>
  <div>
    <div v-for="(data,index) in item" :key="index" class="container qq mt-3 mb-3 text-center">
      <div v-for="(itemData,idx) in data" :key="idx" class="d-flex center">
        <div class="flex-fill w-50 border border-primary">{{idx}}:</div>
        <div class="flex-fill w-50 border border-primary">{{itemData}}</div>
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
          { date: "2019/10/01 12:56:30", CO2: 0 },
          { date: "2019/10/01 12:56:40", CO2: 0 }
        ]
      },
      TemperatureData: {
        columns: ["date", "Temperature"],
        rows: [
          { date: "2019/10/01 12:56:30", Temperature: 29.4 },
          { date: "2019/10/01 12:56:40", Temperature: 29.4 }
        ]
      },
      HumidityData: {
        columns: ["date", "Humidity"],
        rows: [
          { date: "2019/10/01 12:56:30", Humidity: 59.6 },
          { date: "2019/10/01 12:56:40", Humidity: 59.6 }
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

      let socketMsg1 = {
        action: "authenticate",
        token: JSON.parse(localStorage.token).accessToken
      };
      let socketMsg2 = {
        action: "notification/subscribe",
        deviceId: JSON.parse(localStorage.event).id,
        names: ["measurements"]
      };

      const socketUrl = "wss://earth.comismart.com/api/websocket";
      const websocket = new WebSocket(socketUrl);
      websocket.onopen = function() {
        onOpen();
      };
      function onOpen() {
        websocket.send(JSON.stringify(socketMsg1));
        websocket.send(JSON.stringify(socketMsg2));
        websocket.onmessage = function(e) {
          let msg = JSON.parse(e.data);
          let dateTimestamp = msg.notification.timestamp;
          let date = new Date(dateTimestamp);
          let Y = date.getFullYear();
          let M = date.getMonth();
          let D = date.getDay();
          let H = date.getHours();
          let Minutes = date.getMinutes();
          let S = date.getSeconds();
          let time = `${Y}/${M+1}/${D-1} ${H+8}:${Minutes}:${S}`;

          vm.makeChart(
            time,
            msg.notification.parameters.CO2.value,
            msg.notification.parameters.Temperature.value,
            msg.notification.parameters.Humidity.value
          );
        };
      }
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
