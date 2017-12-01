const Fetch = require('isomorphic-fetch');
class UserAct {
  constructor() {
    this.fetch = Fetch;
    this.uid = '';
    this.populateForm();
  }

//This populates the UserProfileForm, found in the userutil.html (or userutil/index.html)
  populateForm() {
    let bodyData = {'email': localStorage.getItem('useremail') };
    let fetchData = {
      method: 'POST',
      body: JSON.stringify(bodyData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };
    return this.fetch(process.env.BackendUrl + '/user/', fetchData)
    .then((response) => response.json())
    .then((data) => {
      console.log('did I get a user or not?');
      console.log(data[0]);
      if (data[0] !== undefined) {
      document.getElementsByClassName('uprofFirstName')[0].value = data[0].first_name;
      document.getElementsByClassName('uprofLastName')[0].value = data[0].last_name;
      document.getElementsByClassName('uprofAff')[0].value = data[0].affiliation;
      document.getElementsByClassName('uprofOrganisms')[0].value = data[0].organisms;
      document.getElementsByClassName('uprofInterests')[0].value = data[0].interests;
      document.getElementsByClassName('uprofEmail')[0].value = data[0].email;
      this.uid = data[0]._id;
      document.getElementsByClassName('UserProfileForm')[0].style.display = 'block';
    } else {
      console.log('no user');
      document.getElementsByClassName('UserProfileForm')[0].style.display = 'none';
      window.location.href = process.env.FrontendUrl + '/';
    }
    });
  }

  updateUserPrefs() {
    let fname = document.getElementsByClassName('uprofFirstName')[0].value;
    let lname = document.getElementsByClassName('uprofLastName')[0].value;
    let bodyData = {'first_name': fname, 'last_name': lname, 'name': fname + ' ' + lname,
      'affiliation': document.getElementsByClassName('uprofAff')[0].value, 'organisms': document.getElementsByClassName('uprofOrganisms')[0].value, 'interests': document.getElementsByClassName('uprofInterests')[0].value};
    let fetchData = {
      method: 'PUT',
      body: JSON.stringify(bodyData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };
    return this.fetch(process.env.BackendUrl + '/user/' + this.uid, fetchData)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementsByClassName('UserProfileForm')[0].style.display = 'none';
      window.location.href = process.env.FrontendUrl + '/';
    });
  }

// this is only the initial request to change the email address from the User Prefs page
  changeUserEmail() {
    let bodyData = {'changeemail': document.getElementsByClassName('uprofEmail')[0].value, 'email': localStorage.getItem('useremail') };
    let fetchData = {
      method: 'PUT',
      body: JSON.stringify(bodyData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return this.fetch(process.env.BackendUrl + '/auth/changeemail', fetchData)
  .then((response) => response.json())
  .then((data) => {
    if (data.message) {
      //console.log(data.message);
      let messagediv = document.getElementsByClassName('formerrors')[0];
      messagediv.innerHTML = '<p style="text-align:center; padding:0">' + data.message + '</p>';
    } else {
      window.location.href = process.env.FrontendUrl + '/userutil/?changeemail=' + document.getElementsByClassName('uprofEmail')[0].value;
    }
  })
  .catch((error) => {
    console.log(error);
  });
  }
}

module.exports = UserAct;
