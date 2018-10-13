// load questions
var forum_content = document.getElementById('forum_content');
var loader = document.getElementById('loader');
var ask_btn = document.getElementById('ask');
var ask_form =  document.getElementById('question_form');
var search_form = document.getElementById("search_form");
var search_error = document.getElementById('search_error')
var response_status = false;

class Questions{

   constructor(){

  }

 get_questions() {
  // fetch all questions from the backend
  var url=" http://stackoverflowgidraf.herokuapp.com/api/v1/questions"
  return fetch(url).then(function (response){
    if (response.status === 200){
      response_status = true;
      loader.style.display = "none"
      return  response.json().then(function (data){
        questions.fetch_questions(data)
      })
    }
    else {
      response_status = true;
      alert ("no question found at the moment")
      loader.style.display = "none"
    }
})
}

fetch_questions(data){
  search_error.innerHTML = ""
  while (forum_content.firstChild) {
    forum_content.removeChild(forum_content.firstChild)
  }
  var questions = data["result"]
  for (var i=0;i<questions.length;i++){
    var question_holder = document.createElement("div")
    var image_holder  = document.createElement("div")
    var username = document.createElement("span")
    var image = document.createElement("img")
    var br = document.createElement("br")
    var username_container = document.createElement("a")
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
    username_container.appendChild(username);
    username_container.appendChild(br)
    answers.innerHTML = " " + questions[i]["answers"] + " answers";
    time.innerHTML = questions[i]["time_created"];
    question_link.appendChild(question_title);
    question_holder.appendChild(image_holder);
    question_holder.appendChild(username_container);
    question_holder.appendChild(br);
    question_holder.appendChild(answers);
    question_holder.appendChild(br);
    question_holder.appendChild(time);
    question_holder.appendChild(clear);
    question_holder.appendChild(question_link);
    forum_content.appendChild(question_holder);
  }
}

 post_question(data){
  // e.preventDefault();
  var token = localStorage.getItem("token");
  const error = document.getElementById('error');
  loader.style.zIndex = "2"
  loader.style.display = "block";
  var url = "  http://stackoverflowgidraf.herokuapp.com/api/v1/add_question";
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
    loader.style.display = "none"
    while (forum_content.firstChild) {
      forum_content.removeChild(forum_content.firstChild)
    }
    questions.get_questions()
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

 add_numbers(a, b) {
  return a+b
}

}

var questions = new Questions();
var get_questions = questions.get_questions();
// for (var key in get_questions){
//   if (get_questions.hasOwnProperty(key))
// }
// }
function ask_question (event) {
  event.preventDefault();
  var data = JSON.stringify({title:ask_form.title.value,description:ask_form.description.value})
  questions.post_question(data)
}

var search = document.getElementById('search_input')
search.addEventListener("keydown", show_search_screen)
ask_btn.addEventListener("click", ask_question);

function show_search_screen(){
  search_form.style.zIndex = "8"
  loader.style.display = "block"
  while (forum_content.firstChild) {
    forum_content.removeChild(forum_content.firstChild)
  }
  search.addEventListener('input', (event)=>{
    error.innerHTML = ""
    loader.style.display = "block"
    var input = this.value;
    if (!input){
      return questions.get_questions();
    }
    var url = " http://stackoverflowgidraf.herokuapp.com/api/v1/search_question";
    data = JSON.stringify({search_text:input});

    fetch(url,{
      method:"POST",
      body :data,
      headers: {"content-type":"application/json; charset = UTF-8",
      "Authorization":"Bearer "+token
    }
  }
).then((response) => {
      if (response.status === 200){
        search_form.style.zIndex = "1"
        loader.style.display = "none"
        response.json().then((data)=>{
          console.log(data);
          while (forum_content.firstChild) {
            forum_content.removeChild(forum_content.firstChild)
          }
          questions.fetch_questions(data);
        })
      }
      else if (response.status === 400) {
        response.json().then((data)=>{
          console.log(data)

        })
      }
      else if (response.status === 404) {
        response.json().then((data)=>{
          loader.style.display = "none"
          search_error.innerHTML = data["error"]
        })
      }
    })
  })
}
