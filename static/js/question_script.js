// load questions
window.onload = get_questions()
var loader = document.getElementById('loader')

function get_questions() {
  // fetch all questions from the database
  forum_content = document.getElementById('forum_content')
  url="https://stackoverflowgidraf.herokuapp.com/api/v1/questions"
  fetch(url).then(function (response){
    if (response.status === 200){
      loader.style.display = "none"
      response.json().then(function (data){
        var questions = data["result"]
        for (i=0;i<questions.length;i++){
          var question_holder = document.createElement("div")
          var image_holder  = document.createElement("div")
          var username = document.createElement("p")
          var image = document.createElement("img")
          var br = document.createElement("br")
          var answers = document.createElement("span")
          var question_link = document.createElement ("a")
          var question_title = document.createElement("h3")
          var time = document.createElement("span")
          var clear = document.createElement("div")
          clear.className = "clear"
          question_title.id ="qt" + questions[i]["questions"]["questionid"];
          question_title.questionid = questions[i]["questions"]["questionid"]
          question_title.className = "question_header";
          question_holder.className = "question_holder";
          question_holder.id = "qh"+ questions[i]["questions"]["questionid"];
          image_holder.className = "user_image";
          answers.className = "question_numbers";
          username.className = "username";
          question_link.id = questions[i]["questions"]["questionid"];
          question_link.href = "question.html";
          question_link.addEventListener("click",storeid)
          image.src = "static/css/img/avatar.png";
          image_holder.appendChild(image);
          time.className = "time";
          question_title.innerHTML = questions[i]["questions"]["title"];
          username.innerHTML = questions[i]["user"];
          answers.innerHTML = questions[i]["answers"] + " answers";
          time.innerHTML = questions[i]["questions"]["time_created"]
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
      alert ("no question found at the moment")
      loader.style.display = "none"
    }
})
}

function post_question(e){
  var token = localStorage.getItem("token");
  const error = document.getElementById('error');
  loader.style.zIndex = "2"
  loader.style.display = "block";
  e.preventDefault();
  form  = document.getElementById('question_form');
  data = JSON.stringify({title:form.title.value, description:form.description.value});
  url = "https://stackoverflowgidraf.herokuapp.com/api/v1/add_question";
  fetch(url,{
    method:"POST",
    body :data,
    headers: {"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function (response){
  if (response.status === 201){
    form.title.value = ""
    form.description.value = ""
    loader.style.display = "none"
    get_questions()
    close_modal()
  }
  else if (response.status ===  400)  {
    loader.style.display = "none"
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

function storeid(event) {
  event.preventDefault();
  localStorage.setItem('id',event.target.questionid)
  window.location.href = "question.html"
}
