// script should fetch all user's questions
// script should allow user to edit,delete question
var token = localStorage.getItem('token')
var user  = parseJwt(token)["identity"]
const forum_content =document.getElementById('forum_content')

get_user_questions()















function get_user_questions(){
  var url = "http://localhost:5000/api/v1/user/questions/"+user["userid"]
  fetch(url,{
  method: "GET",
  headers: {"content-type":"application/json; charset = UTF-8",
  "Authorization":"Bearer "+token
}}
).then(function(response){
  if (response.status === 200){
    response.json().then(function (data){
      var questions = data["result"]
      for (i=0;i<questions.length;i++){
        id = questions[i]["questions"]["questionid"]
        var question_holder = document.createElement("div")
        var image_holder  = document.createElement("div")
        var username = document.createElement("span")
        var image = document.createElement("img")
        var br = document.createElement("br")
        var answers = document.createElement("p")
        var question_link = document.createElement ("a")
        var question_title = document.createElement("h3")
        var time = document.createElement("span")
        var delete_btn =  document.createElement("button")
        var edit_btn = document.createElement("button")
        var clear = document.createElement("div")
        clear.className = "clear"
        question_title.className = "question_header";
        question_holder.className = "question_holder";
        image_holder.className = "user_image";
        answers.className = "question_numbers";
        username.className = "username";
        delete_btn.className = "delete"
        delete_btn.id = questions[i]["questions"]["questionid"]
        delete_btn.addEventListener('click',delete_question)
        edit_btn.className = "edit"
        question_link.href = "question.html";
        image.src = "static/css/img/avatar.png";
        image_holder.appendChild(image);
        time.className = "time";
        question_title.innerHTML = questions[i]["questions"]["title"];
        username.innerHTML = questions[i]["user"];
        answers.innerHTML = questions[i]["answers"] + " answers";
        time.innerHTML = questions[i]["questions"]["time_created"]
        delete_btn.innerHTML = "Delete"
        edit_btn.innerHTML = "Edit"
        question_link.appendChild(question_title)
        question_holder.appendChild(image_holder)
        question_holder.appendChild(username)
        question_holder.appendChild(edit_btn)
        question_holder.appendChild(delete_btn)
        question_holder.appendChild(br)
        question_holder.appendChild(answers)
        question_holder.appendChild(br)
        question_holder.appendChild(time)
        question_holder.appendChild(clear)
        question_holder.appendChild(question_link)
        forum_content.appendChild(question_holder)
      }
    })
  }
  else  if (response.status === 401){
    window.location.href = "signin.html"
  }
}).then(function (data){

})
}
function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
};


function post_question(e){
  var token = localStorage.getItem("token")
  const error = document.getElementById('error')
  e.preventDefault();
  form  = document.getElementById('question_form')
  data = JSON.stringify({title:form.title.value, description:form.description.value})
  url = "http://localhost:5000/api/v1/add_question"
  fetch(url,{
    method:"POST",
    body :data,
    headers: {"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function (response){
  if (response.status === 201){
    alert("Question asked")
    get_user_questions()
    close_modal()
  }
  else if (response.status ===  400)  {
    response.json().then(function (data){
      error.style.display = "block"
      error.style.background = "ghostwhite"
      error.textContent = data["error"]
    })
  }
  else if (response.status === 404) {
    // create a 404 div to display
  }

  else if (response.status === 401) {
    alert ("please login first")
    window.location.href = "signin.html"
  }
})
}

function delete_question(event) {
  id = event.target.id
  url = "http://localhost:5000/api/v1/delete_question/"+id
  fetch(url,{
    method: "delete",
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function(response){
  if (response.status === 200){
    alert ("question deleted")
    while (forum_content.firstChild) {
      forum_content.removeChild(forum_content.firstChild)
    }
    get_user_questions()
  }
  else if (response.status == 404) {
    alert("question not found")
    get_user_questions()
  }
})

}
