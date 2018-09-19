// this script will handle scripts for users
  const error = document.getElementById('error')

function register_user(e)
{
  const register_url = "http://localhost:5000/auth/register"
  e.preventDefault();
  const signupform=document.getElementById('signupform')
  if (signupform.password.value == signupform.confirm_password.value){
    error.style.display = "none"
    data = JSON.stringify({"username": signupform.username.value,
    "useremail":signupform.email.value,
    "password":signupform.password.value})
    fetch(register_url,{
      method: 'POST',
      body : data,
      headers :{"content-type":"application/json; charset = UTF-8"}
    }).then(function (response){
      if (response.status === 201) {
      response.json().then( function (data) {
      error.style.display = "none"
      alert(data["success"])
      window.location.href = "signin.html"
      }
      )
      }
      else if  (response.status === 401) {
        response.json().then(
          function (data){
            error.style.display="block"
            error.innerHTML = data["warning"]
            console.log(data["warning"]);
          }
        )
      }
      else if (response.status === 400) {
        response.json().then(
          function (data){
            error.style.display="block"
            error.innerHTML = data["error"]
            console.log(data["warning"]);
          }
        )
      }

    }).then( function (data){

    })
  }
  else {
    e.preventDefault();
    error.style.display="block";
    error.innerHTML = "password does not match"
  }
}

function login_user(e)
{
  const login_url = "http://localhost:5000/auth/login"
  e.preventDefault();
  signinForm = document.getElementById('signinForm')
  data = JSON.stringify({"username":signinForm.username.value,
     "password":signinForm.password.value})
     fetch(login_url,{
       method: 'POST',
       body : data,
       headers :{"content-type":"application/json; charset = UTF-8"}
     }).then(function (response){
       if (response.status === 200) {
       response.json().then( function (data) {
        // var reaponse_data = JSON.parse(data)
         localStorage.setItem("token",data["token"])
         var info = localStorage.getItem("token");
         console.log(info);
         error.style.display = "none"
         window.location.href = "index.html"
       }
       )
       }
       else if  (response.status === 401 || response.status === 400) {
         response.json().then(
           function (data){
             error.style.display="block"
             error.innerHTML = data["error"]
             console.log(data["error"]);
           }
         )
       }
       else if (response.status === 400 || response.status === 404) {
         response.json().then(
           function (data){
             error.style.display="block"
             error.innerHTML = data["error"]
             console.log(data["warning"]);
           }
         )
       }
     }).then( function (data){

     })
}
