// load questions
require('es6-promise').polyfill();
require('isomorphic-fetch');
var forum_content = document.getElementById('forum_content');
var loader = document.getElementById('loader');
var ask_btn = document.getElementById('ask');
var ask_form =  document.getElementById('question_form');
var response_status = false;

class Questions{


   constructor(){

  }

 get_questions() {
  // fetch all questions from the backend
  var url="http://127.0.0.1:5000/api/v1/questions"
  return fetch(url).then(function (response){
    if (response.status === 200){
      response_status = true;
      loader.style.display = "none"
      return  response.json().then(function (data){
        var questions = data["result"]
        for (var i=0;i<questions.length;i++){
          var question_holder = document.createElement("div")
          var image_holder  = document.createElement("div")
          var username = document.createElement("p")
          var image = document.createElement("img")
          var br = document.createElement("br")
          var answers = document.createElement("span")
          var question_link = document.createElement ("a")
          var question_title = document.createElement("h3")
          var time = document.createElement("a")
          var clear = document.createElement("div")
          clear.className = "clear"
          question_title.id ="qt" + questions[i]["questionid"];
          question_title.questionid = questions[i]["questionid"]
          question_title.className = "question_header";
          question_holder.className = "question_holder";
          question_holder.id = "qh"+ ["questionid"];
          image_holder.className = "user_image";
          answers.className = "question_numbers";
          username.className = "username";
          question_link.href = "question.html";
          question_link.addEventListener("click",() => {
            event.preventDefault();
            localStorage.setItem('id',event.target.questionid)
            window.location.href = "question.html"
          });
          image.src = "static/css/img/avatar.png";
          image_holder.appendChild(image);
          time.className = "time";
          question_title.innerHTML = questions[i]["title"];
          username.innerHTML = questions[i]["username"];
          answers.innerHTML = questions[i]["answers"] + " answers";
          time.innerHTML = questions[i]["time_created"]
          question_link.appendChild(question_title)
          question_holder.appendChild(image_holder)
          question_holder.appendChild(username)
          question_holder.appendChild(answers)
          question_holder.appendChild(br)
          question_holder.appendChild(time)
          question_holder.appendChild(clear)
          question_holder.appendChild(question_link)
          forum_content.appendChild(question_holder)
        }

      })
    }
    else {
      response_status = true;
      alert ("no question found at the moment")
      loader.style.display = "none"
    }
})
}

 post_question(data){
  // e.preventDefault();
  var token = localStorage.getItem("token");
  const error = document.getElementById('error');
  // loader.style.zIndex = "2"
  // loader.style.display = "block";
  var url = " http://127.0.0.1:5000/api/v1/add_question";
  return fetch(url,{
    method:"POST",
    body :data,
    headers: {"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function (response){
  if (response.status === 201){
    ask_form.title.value = ""
    ask_form.description.value = ""
    // loader.style.display = "none"
    while (forum_content.firstChild) {
      forum_content.removeChild(forum_content.firstChild)
    }
    questions.get_questions()
    close_modal()
  }
  else if (response.status ===  400)  {
    // loader.style.display = "none"
    response.json().then(function (data){
      error.style.display = "block"
      error.textContent = data["error"]
    })
  }
  else if (response.status === 401) {
    window.location.href = "signin.html"
  }
})
}

 add_numbers(a, b) {
  return a+b
}

}

var questions = new Questions();
var get_questions = questions.get_questions();
for (var key in get_questions){
  if (get_questions.hasOwnProperty(key))
  console.log(key, get_questions[ey]);
}
console.log(get_questions);
function ask_question (event) {
  event.preventDefault();
  var data = JSON.stringify({title:ask_form.title.value,description:ask_form.description.value})
  questions.post_question(data)
}

// ask_btn.addEventListener("click", ask_question);
module.exports = questions;
