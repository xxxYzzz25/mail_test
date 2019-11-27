let addList = document.querySelector("#addList"),
  addListBtn = document.querySelector("#addListBtn"),
  addEmail = document.querySelector("#addEmail"),
  addEmailBtn = document.querySelector("#addEmailBtn"),
  campaignBtn = document.querySelector("#campaignBtn"),
  deleteBtn = document.querySelector("#deleteBtn"),
  myListName = document.querySelector("#myListName"),
  myListId = document.querySelector("#myListId"),
  contactBox = document.querySelector(".contactBox"),
  config = {
    dc: "us4",
    apiKey: "c1e0f072748e39620d4aedf9d1a97ab8-us4",
    listId: ""
  },
  cors = "https://cors-anywhere.herokuapp.com/";

deleteBtn.addEventListener("click", () => {
  deleteList();
  deleteCampaigns();
});
addListBtn.addEventListener("click", () => {
  createList();
});
addEmailBtn.addEventListener("click", () => {
  addMember();
});
campaignBtn.addEventListener("click", () => {
  createCampaign();
});

(function getListsId() {
  axios({
    method: "get",
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/lists`
  })
    .then(function(res) {
      console.log(res);
      config.listId = res.data.lists[0].id;
      myListName.innerText = res.data.lists[0].name;
      myListId.innerText = res.data.lists[0].id;
      axios({
        method: "get",
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        },
        url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/lists/${config.listId}/members`
      })
        .then(function(res) {
          console.log(res);
          for (const i in res.data.members) {
            contactBox.innerHTML += `
              <div class="item">
                Email:
                <div class="itemEmail">${res.data.members[i].email_address}</div>
              </div>
            `;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
})();

function deleteList() {
  axios({
    method: "delete",
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/lists/${config.listId}`
  })
    .then(function(res) {
      console.log(res);
      myListName.innerHTML = "";
      myListId.innerHTML = "";
      contactBox.innerHTML = "";
      alert("delete list success!!");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function deleteCampaigns() {
  axios({
    method: "get",
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/campaigns`
  })
    .then(function(res) {
      console.log(res);
      axios({
        method: "delete",
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        },
        url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/campaigns/${res.data.campaigns[0].id}`
      })
        .then(function(res) {
          console.log(res);
          alert("delete campaigns success!!");
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
}

function createList() {
  if (addList.value != "") {
    let listData = {
      name: addList.value,
      contact: {
        company: "123",
        address1: "123",
        address2: "123",
        city: "123",
        state: "123",
        zip: "123",
        country: "123",
        phone: "123"
      },
      permission_reminder: "123",
      campaign_defaults: {
        from_name: "234",
        from_email: "234@gmail.com",
        subject: "234",
        language: "234"
      },
      email_type_option: true
    };
    axios({
      method: "post",
      headers: {
        Authorization: `Bearer ${config.apiKey}`
      },
      url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/lists`,
      data: JSON.stringify(listData)
    })
      .then(function(res) {
        console.log(res.data);
        config.listId = res.data.id;
        myListName.innerText = res.data.name;
        myListId.innerText = res.data.id;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

function addMember() {
  if (addEmail.value != "") {
    let memberData = {
      email_address: addEmail.value,
      status: "subscribed"
    };
    axios({
      method: "post",
      headers: {
        Authorization: `Bearer ${config.apiKey}`
      },
      url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/lists/${config.listId}/members`,
      data: JSON.stringify(memberData)
    })
      .then(function(res) {
        console.log(res);
        contactBox.innerHTML += `
          <div class="item">
            Email:
            <div class="itemEmail">${res.data.email_address}</div>
          </div>
        `;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

function createCampaign() {
  let campaignData = {
    type: "regular",
    recipients: {
      list_id: config.listId
    },
    settings: {
      subject_line: "Hello",
      from_name: "aaa",
      reply_to: "aaaaa@gmail.com",
      auto_footer: true,
      template_id: 1
    }
  };
  axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/campaigns`,
    data: JSON.stringify(campaignData)
  })
    .then(function(res) {
      console.log(res.data);
      sendCampaign(res.data.id);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function sendCampaign(campaignsID) {
  axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${cors}https://${config.dc}.api.mailchimp.com/3.0/campaigns/${campaignsID}/actions/send`
  })
    .then(function(res) {
      console.log(res);
      alert("send success!");
    })
    .catch(function(error) {
      console.log(error);
    });
}
