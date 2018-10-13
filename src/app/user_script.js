// this script will handle scripts for users
  const error = document.getElementById('error')
  // var loader = document.getElementById('loader')
  var loader =document.getElementById('load')
  var success_image = document.getElementById('successAnimation');
  if (success_image){
      success_image.style.display = "none"
  }
  // load.style.display = "none"
  loader.style.display = "none"
  // loader.style.display = "none"

function register_user(e)
{
  const register_url = "  http://127.0.0.1:5000/auth/register"
  e.preventDefault();
  loader.style.display = "block"
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
      loader.style.display = "none";
      success_image.style.display = "block"
      response.json().then( function (data) {
      error.style.color = "green";
      error.style.display = "block";
      error.style.zIndex = "2"
      error.style.fontSize = "4vw"
      error.innerHTML = data["success"]
      window.setTimeout(openSignInPage, 3000)
      }
      )
      }
      else if  (response.status === 401) {
        loader.style.display = "none"
        response.json().then(
          function (data){
            error.style.display="block"
            error.innerHTML = data["warning"]
          }
        )
      }
      else if (response.status === 400) {
        loader.style.display = "none"
        response.json().then(
          function (data){
            error.style.display="block"
            error.innerHTML = data["error"]
          }
        )
      }

    }).then( function (data){

    })
  }
  else {
    e.preventDefault();
    loader.style.display = "none"
    error.style.display="block";
    error.innerHTML = "password does not match"
  }
}

function login_user(e)
{
  const login_url = "  http://127.0.0.1:5000/auth/login"
  e.preventDefault();
  loader.style.display = "block"
  signinForm = document.getElementById('signinForm')
  data = JSON.stringify({"username":signinForm.username.value,
     "password":signinForm.password.value})
     fetch(login_url,{
       method: 'POST',
       body : data,
       headers :{"content-type":"application/json; charset = UTF-8"}
     }).then(function (response){
       loader.style.display = "none"
       if (response.status === 200) {
       response.json().then( function (data) {
         localStorage.setItem("token",data["token"])
         error.style.display = "none"
         window.location.href = "index.html"
       }
       )
       }
       else if  (response.status === 401 || response.status === 400) {
         response.json().then(
           function (data){
             loader.style.display = "none";
             error.style.display="block";
             error.innerHTML = data["error"];
           }
         )
       }
       else if (response.status === 400 || response.status === 404) {
         response.json().then(
           function (data){
             loader.style.display = "none"
             error.style.display="block"
             error.innerHTML = data["error"]
             console.log(data["warning"]);
           }
         )
       }
     }).then( function (data){

     })
}

function openSignInPage(){
  window.location.href = "signin.html"
}
