// script should fetch all user's questions
// script should allow user to edit,delete question
var token = localStorage.getItem('token'); // get token
var user  = parseJwt(token)["identity"]; // decode token
const forum_content =document.getElementById('forum_content');
var form  = document.getElementById('question_form');
var update_form = document.getElementById('update_form');
var question_modal = document.getElementById('question_modal')
var update_modal = document.getElementById('update_modal')
var error = document.getElementById('error')
var username = document.getElementById('username')
var question_answered = document.getElementById('question_answered')
var question_asked = document.getElementById('question_asked')
var delete_modal = document.getElementById('delete_modal')
var delet_cancel_btn =  document.getElementById('delet_cancel_btn')
var loading_image = document.getElementById('loading_image')
var delete_title = document.getElementById('delete_title')
delet_cancel_btn.addEventListener("click",close_delete_modal)
delete_modal.style.display = "none"
loading_image.style.display = "none"
var questions
var loader = document.getElementById('loader')
username.innerHTML = user['username']
window.onload = get_user_questions();

// get user questions and populate it to the views
function get_user_questions(){
  loader.style.display = "block"
  var url = "https://stackoverflowgidraf.herokuapp.com/api/v1/user/questions/" + user["userid"]
  fetch(url,{
  method: "GET",
  headers: {"content-type":"application/json; charset = UTF-8",
  "Authorization":"Bearer "+token
}}
).then(function(response){
  if (response.status === 200){
    loader.style.display = "none"
    response.json().then(function (data){
      questions = data["result"];
      question_asked.innerHTML = questions.length + " questions"
      for (i=0;i<questions.length;i++){
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
        question_holder.id = 'qh' +  questions[i]["questions"]["questionid"]
        image_holder.className = "user_image";
        answers.className = "question_numbers";
        username.className = "username";
        delete_btn.className = "delete"
        delete_btn.id = questions[i]["questions"]["questionid"]
        delete_btn.addEventListener('click',open_delete_modal)
        edit_btn.className = "edit"
        edit_btn.idValue = questions[i]["questions"]["questionid"]
        edit_btn.titleValue = questions[i]["questions"]["title"]
        edit_btn.descriptionValue = questions[i]["questions"]["description"]
        question_link.questionid = questions[i]["questions"]["questionid"]
          question_title.questionid = questions[i]["questions"]['questionid']
        question_link.addEventListener("click",storeid)
        question_link.href = "question.html";
        image.src = "static/css/img/avatar.png";
        image_holder.appendChild(image);
        time.className = "time";
        question_title.id = "qt" + questions[i]["questions"]['questionid']
        question_title.innerHTML =questions[i]["questions"]["title"];
        username.innerHTML = questions[i]["user"];
        answers.innerHTML = questions[i]["answers"] + " answers";
        time.innerHTML = questions[i]["questions"]["time_created"]
        delete_btn.innerHTML = "Delete"
        edit_btn.innerHTML = "Edit"
        edit_btn.addEventListener("click",show_update_modal)
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
  else  if (response.status === 404){
    loader.style.display = "none"
    alert("No question found")
  }
  else if (response.status === 400) {
    response.json().then(function (data){

    })

  }
}).then(function (data){

})
}
// decode token
function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
};
// post question
function post_question(e){
  var token = localStorage.getItem("token")
  e.preventDefault();
  loader.style.zIndex = "2"
  loader.style.display = "block"
  data = JSON.stringify({title:form.title.value,
    description:form.description.value})
  url = "https://stackoverflowgidraf.herokuapp.com/api/v1/add_question"
  fetch(url,{
    method:"POST",
    body :data,
    headers: {"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function (response){
  if (response.status === 201){
    while (forum_content.firstChild) {
      forum_content.removeChild(forum_content.firstChild)
    }
    form.title.value = "";
    form.description.value = "";
    get_user_questions()
    close_modal()
    loader.style.display = "none"
  }
  else if (response.status ===  400)  {
    response.json().then(function (data){
      error.style.display = "block"
      error.textContent = data["error"]
      loader.style.display = "none"
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

// delete question
function delete_question(event) {
  id = event.target.questionid
  loading_image.style.display = "inline"
  var holder = document.getElementById('qh'+id)
  url = "https://stackoverflowgidraf.herokuapp.com/api/v1/delete_question/"+id
  fetch(url,{
    method: "delete",
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function(response){
  if (response.status === 200){
    loading_image.style.display = "none"
    delete_title.textContent = "Deleted!!"
    window.setTimeout(close_delete_modal,1500)
    forum_content.removeChild(holder)
    question_asked.innerHTML = forum_content.children.length + " Questions"
  }
  else if (response.status == 404) {
    get_user_questions()
  }
})
}

function show_update_modal(event) {
  update_form.title.value= event.target.titleValue
  update_form.title.id=event.target.idValue // store id value to title
  update_form.description.value = event.target.descriptionValue
  update_modal.classList.toggle('question_modal')
}

function update_question(event){
  event.preventDefault();
  var update_error = document.getElementById('update_error')
  var question = document.getElementById('qt'+ update_form.title.id)
  url = "https://stackoverflowgidraf.herokuapp.com/api/v1/update_question/"+ update_form.title.id
  data = JSON.stringify({"title":update_form.title.value,
  "description":update_form.description.value})
  fetch(url,{
    method: "PUT",
    body: data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function (response) {
  if (response.status === 200){
    question.innerHTML = update_form.title.value
    close_update_modal()
  }
  else if (response.status === 400) {
    response.json().then(function (data){
      update_error.style.display = "block";
      update_error.style.color = 'red'
      update_error.textContent = data["error"]

    })
  }
})
}

function close_update_modal() {
  update_modal.classList.toggle("question_modal")
}

window.onclick= function (event) {
  if(event.target==update_modal){
    update_modal.classList.toggle('question_modal')
  }
}

function storeid(event) {
  event.preventDefault();
  localStorage.setItem('id',event.target.questionid)
  window.location.href = "question.html"
}

function open_delete_modal (event){
  event.preventDefault();
  var delete_btn = document.getElementById('delete_btn')
  delete_btn.questionid = event.target.id
  delete_modal.style.display = "block"
  delete_btn.addEventListener("click",delete_question)
}

function close_delete_modal(){
  delete_title.textContent = "Are sure you want to delete!!"
  delete_modal.style.display = "none"
}
