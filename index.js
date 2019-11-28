let addList = document.querySelector('#addList'),
  addListBtn = document.querySelector('#addListBtn'),
  addEmail = document.querySelector('#addEmail'),
  addEmailBtn = document.querySelector('#addEmailBtn'),
  campaignBtn = document.querySelector('#campaignBtn'),
  deleteBtn = document.querySelector('#deleteBtn'),
  myListName = document.querySelector('#myListName'),
  myListId = document.querySelector('#myListId'),
  contactBox = document.querySelector('.contactBox'),
  btnBox = document.querySelector('.btnBox'),
  config = {
    dc: 'us4',
    apiKey: '5f0950fc849a0d2f9b259a44be7256ae-us4',
    listId: ''
  },
  cors = 'https://cors-anywhere.herokuapp.com/',
  basicUrl = `${cors}https://${config.dc}.api.mailchimp.com/3.0`;

deleteBtn.addEventListener('click', () => {
  btnBox.style.display = 'none';
  deleteCampaigns();
});
addListBtn.addEventListener('click', () => {
  btnBox.style.display = 'none';
  createList();
});
addEmailBtn.addEventListener('click', () => {
  btnBox.style.display = 'none';
  addMember();
});
campaignBtn.addEventListener('click', () => {
  btnBox.style.display = 'none';
  createCampaigns();
});

(function getListsId() {
  axios({
    method: 'get',
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${basicUrl}/lists`
  })
    .then(function(res) {
      console.log(res);
      if (res.data.lists[0]) {
        config.listId = res.data.lists[0].id;
        myListName.innerText = res.data.lists[0].name;
        myListId.innerText = res.data.lists[0].id;
        getListMember();
        btnBox.children[0].style.display = 'none';
      } else {
        btnBox.children[1].style.display = 'none';
        btnBox.children[2].style.display = 'none';
        btnBox.children[3].style.display = 'none';
        btnBox.style.display = 'flex';
      }
    })
    .catch(function(error) {
      console.log(error);
    });
})();

function getListMember() {
  axios({
    method: 'get',
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${basicUrl}/lists/${config.listId}/members`
  })
    .then(function(res) {
      console.log(res);
      if (res.data.members[0]) {
        for (const i in res.data.members) {
          contactBox.innerHTML += `
            <div class="item">
              Email:
              <div class="itemEmail">${res.data.members[i].email_address}</div>
            </div>
          `;
        }
      } else {
        btnBox.children[2].style.display = 'none';
      }
      btnBox.style.display = 'flex';
    })
    .catch(function(error) {
      console.log(error);
    });
}

function deleteCampaigns() {
  axios({
    method: 'get',
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${basicUrl}/campaigns`
  })
    .then(function(res) {
      console.log(res);
      for (const key in res.data.campaigns) {
        axios({
          method: 'delete',
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          },
          url: `${basicUrl}/campaigns/${res.data.campaigns[key].id}`
        })
          .then(function(res) {
            console.log(res);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      alert('Delete Campaigns Success!!');
      deleteList();
    })
    .catch(function(error) {
      console.log(error);
    });
}

function deleteList() {
  axios({
    method: 'delete',
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${basicUrl}/lists/${config.listId}`
  })
    .then(function(res) {
      console.log(res);
      myListName.innerHTML = '';
      myListId.innerHTML = '';
      contactBox.innerHTML = '';
      alert('Delete List Success!!');
      btnBox.style.display = 'flex';
      btnBox.children[0].style.display = 'flex';
      btnBox.children[1].style.display = 'none';
      btnBox.children[2].style.display = 'none';
      btnBox.children[3].style.display = 'none';
    })
    .catch(function(error) {
      console.log(error);
    });
}

function createList() {
  if (addList.value != '') {
    let listData = {
      name: addList.value,
      contact: {
        company: 'abc',
        address1: 'abc',
        address2: 'abc',
        city: 'qaz',
        state: 'wsx',
        zip: '321',
        country: 'edc',
        phone: '0999999999'
      },
      permission_reminder: '555',
      campaign_defaults: {
        from_name: 'tgb',
        from_email: 'qqq@gmail.com',
        subject: 'yhn',
        language: 'ujm'
      },
      email_type_option: true
    };
    axios({
      method: 'post',
      headers: {
        Authorization: `Bearer ${config.apiKey}`
      },
      url: `${basicUrl}/lists`,
      data: JSON.stringify(listData)
    })
      .then(function(res) {
        console.log(res.data);
        config.listId = res.data.id;
        myListName.innerText = res.data.name;
        myListId.innerText = res.data.id;
        addList.value = '';
        btnBox.style.display = 'flex';
        btnBox.children[0].style.display = 'none';
        btnBox.children[1].style.display = 'flex';
        btnBox.children[3].style.display = 'flex';
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

function addMember() {
  if (addEmail.value != '') {
    let memberData = {
      email_address: addEmail.value,
      status: 'subscribed'
    };
    axios({
      method: 'post',
      headers: {
        Authorization: `Bearer ${config.apiKey}`
      },
      url: `${basicUrl}/lists/${config.listId}/members`,
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
        addEmail.value = '';
        btnBox.style.display = 'flex';
        btnBox.children[2].style.display = 'flex';
      })
      .catch(function(error) {
        console.log(error);
        alert('Please Enter Valid Email');
        btnBox.style.display = 'flex';
      });
  } else {
    alert('Please Enter Member Email!!');
    btnBox.style.display = 'flex';
  }
}

function createCampaigns() {
  let campaignsData = {
    type: 'regular',
    recipients: {
      list_id: config.listId
    },
    settings: {
      subject_line: 'Hello',
      from_name: 'aaa',
      reply_to: 'aaaaa@gmail.com',
      auto_footer: true,
      template_id: 1
    }
  };
  axios({
    method: 'post',
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${basicUrl}/campaigns`,
    data: JSON.stringify(campaignsData)
  })
    .then(function(res) {
      console.log(res.data);
      sendCampaigns(res.data.id);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function sendCampaigns(campaignsID) {
  axios({
    method: 'post',
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    url: `${basicUrl}/campaigns/${campaignsID}/actions/send`
  })
    .then(function(res) {
      console.log(res);
      alert('Send Campaigns Success!');
      btnBox.style.display = 'flex';
    })
    .catch(function(error) {
      console.log(error);
    });
}
