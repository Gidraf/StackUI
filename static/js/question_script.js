get_questions()

function get_questions() {
  // fetch all questions from the database
  forum_content = document.getElementById('forum_content')
  url="http://localhost:5000/api/v1/questions"
  fetch(url).then(function (response){
  return  response.json()
}).then(function (data){
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
    question_title.id = questions[i]["questions"]["questionid"];
    question_title.className = "question_header";
    question_holder.className = "question_holder";
    image_holder.className = "user_image";
    answers.className = "question_numbers";
    username.className = "username";
    question_link.href = "question.html";
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
    console.log(answers)
  }
})
}
