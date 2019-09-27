<template>
  <div class="text-center">
    <form class="form-signin" @submit.prevent="signIn">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputName" class="sr-only">Username</label>
      <input
        type="text"
        id="inputName"
        name="name"
        class="form-control"
        :class="{'is-invalid':errors.has('name')}"
        placeholder="Username"
        v-model="user.username"
        required
        autofocus
        v-validate="'required'"
      />
      <b-alert show variant="danger" v-show="errors.has('name')">{{ errors.first('name') }}</b-alert>
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        type="password"
        id="inputPassword"
        name="psd"
        class="form-control"
        :class="{'is-invalid':errors.has('psd')}"
        placeholder="Password"
        v-model="user.password"
        required
        v-validate="'required|min:6'"
      />
      <b-alert show variant="danger" v-show="errors.has('psd')">{{ errors.first('psd') }}</b-alert>
      <b-button
        class="btn btn-lg btn-primary btn-block"
        size="lg"
        :disabled="disabled"
        variant="primary"
        @click="signIn"
      >Sign in</b-button>
      <b-alert show variant="danger" v-show="error">請輸入正確帳號密碼</b-alert>
      <p class="mt-5 mb-3 text-muted">&copy; 2019.09</p>
    </form>
  </div>
</template>

<script>
// this.$validator.validateAll().then(function(result) {
//   if (result) {
//     //成功操作
//     alert(111)
//     this.disabled = false;

//   } else {
//     // 失敗操作
//   }
// });
const axios = require("axios");
export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      disabled: false,
      error: false
    };
  },
  methods: {
    signIn() {
      const vm = this;
      if (this.user.username == "test" && this.user.password == "123456") {
        vm.error == false;
        const submitData = {
          login: this.user.username,
          password: this.user.password
        };
        axios({
          method: "post",
          headers: { "Content-Type": "application/json" },
          url: "https://earth.comismart.com/auth/rest/token",
          data: JSON.stringify(submitData)
        }).then(function(res) {
          // console.log(res.data);
          // if (res.stsatus == "401") {
          //   axios({
          //     method: "post",
          //     headers: { "Content-Type": "application/json" },
          //     url: "https://earth.comismart.com/auth/rest/token/refresh",
          //     data: JSON.stringify()
          //   });
          // }
          localStorage.setItem("token", JSON.stringify(res.data));
          var varToken = res.data.accessToken;
          var tenant = res.data.tenant;
          axios({
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + varToken,
              tenant: tenant
            },
            url: "https://earth.comismart.com/api/rest/device/1540281688669"
          }).then(function(res) {
            // console.log(res.data);
            localStorage.setItem("event", JSON.stringify(res.data));
            vm.$router.push("/Dashboard");
          });
        });
      } else {
        vm.error = true;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.text-center {
  height: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
  .form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
    .checkbox {
      font-weight: 400;
    }
    .form-control {
      position: relative;
      box-sizing: border-box;
      height: auto;
      padding: 10px;
      font-size: 16px;
      &:focus {
        z-index: 2;
      }
    }
    input[type="text"] {
      margin-bottom: 10px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
    input[type="password"] {
      margin-bottom: 10px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
}
</style>
