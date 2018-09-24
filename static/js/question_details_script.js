// show all the question inforamtion

var token = localStorage.getItem('token');

if (token){
var user  = parseJwt(token)["identity"];
var question_title
var loader = document.getElementById('loader')
// populate
window.onload = get_question_details()

// get question details
function get_question_details(){
  var id = localStorage.getItem('id')
  url = "https://stackoverflowgidraf.herokuapp.com/api/v1/answers/"+id
  fetch(url,{
    method:"GET",
    headers: {"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
  }
).then(function (response){
  if (response.status === 200){
    loader.style.display = "none"
    response.json().then(function(data){
    var title = document.getElementById('question_title')
    var description = document.getElementById('question_description')
    var question = data['question']
    title.innerHTML = data["question"]['title']
    description.innerHTML = data["question"]['description']
    answers_list = data["answers"]
    answers = answers_list.sort(function (a, b){
      return (b-a)
    })
    forum_content = document.getElementById('forum_content')
    for (i=0;i<answers.length;i++){
      var loader = document.createElement("div")
      var loading_image = document.createElement('img')
      var answer_holder = document.createElement('div')
      var answers_labels = document.createElement('div')
      var answer_username = document.createElement('span')
      var votes_labels = document.createElement('span')
      var clear = document.createElement('clear')
      var error_text = document.createElement('span')
      var time = document.createElement('span')
      var form = document.createElement('form')
      var update = document.createElement('button')
      var answer_text = document.createElement('textarea')
      var edit_btn = document.createElement('a')
      var delete_btn = document.createElement('a')
      var accept_btn = document.createElement('a')
      var edit_control = document.createElement('div')
      var votes_container = document.createElement('votes')
      var upvote = document.createElement('a')
      var downvote = document.createElement('a')
      var answer = document.createElement('p')
      var br = document.createElement('br')
      loader.id= "l" + answers[i]['answerid']
      loading_image.src = "static/css/img/loading.png"
      loading_image.className = "loading user_image"
      loading_image.id = "li"+answers[i]["answerid"]
      loading_image.style.display = "none"
      form.method = "post"
      form.id = "f"+answers[i]['answerid']
      form.is_open = false
      form.appendChild(answer_text)
      form.appendChild(br)
      form.appendChild(error_text)
      error_text.id = "e" + answers[i]['answerid']
      update.className = 'ask'
      update.id =  answers[i]['answerid']
      form.appendChild(update)
      answer_text.name = "answer_text"
      answer_text.value = answers[i]['answer_text']
      form.onsubmit = 'update_answer(event)'
      update.innerHTML = "Update"
      edit_control.className = 'votes'
      form.style.display = 'none'
      delete_btn.className = 'delete'
      delete_btn.innerHTML = 'Delete'
      delete_btn.href = '#'
      delete_btn.id = answers[i]["answerid"]
      delete_btn.addEventListener('click',delete_answer)
      edit_btn.href = '#'
      edit_btn.id = answers[i]['answerid']
      edit_btn.innerHTML = 'Edit'
      edit_btn.className = 'edit'
      accept_btn.className = "accept"
      accept_btn.href ="#"
      accept_btn.innerHTML = "Accept"
      accept_btn.style.color = "green"
      accept_btn.id =answers[i]["answerid"]
      accept_btn.addEventListener('click',mark_as_prefered)
      votes_container.style.display = 'none'
      if (user["userid"] !== answers[i]['userid']){
        edit_control.style.display = 'none'
        votes_container.style.display = 'block'
      }
      edit_control.appendChild(delete_btn);
      edit_control.appendChild(edit_btn);
      answer_holder.className = "answer_holder";
      answer_holder.id = "ah"+answers[i]["answerid"]
      answers_labels.className = "answer_labels";
      answer_username.className = "answer_username";
      votes_container.className = 'votes';
      downvote.className = 'downvote';
      downvote.href = '#';
      upvote.href = '#';
      votes_labels.className = 'votes_labels';
      answer.className = 'answer';
      answer.id ="a" + answers[i]["answerid"]
      clear.className = 'clear';
      upvote.innerHTML = "upvote";
      upvote.answerid = answers[i]["answerid"]
      upvote.addEventListener("click",upvote_answer)
      downvote.answerid = answers[i]["answerid"]
      downvote.addEventListener("click",downvote_answers)
      downvote.innerHTML = "downvote";
      answer_username.innerHTML = answers[i]['username'];
      votes_labels.innerHTML = answers[i]['votes'] + " votes";
      time.innerHTML = answers[i]['time_created'];
      votes_container.appendChild(upvote);
      votes_container.appendChild(downvote);
      answer.innerHTML = answers[i]['answer_text'];
      update.addEventListener("click",function(event){
        event.preventDefault();
        id = event.target.id
        var lc = document.getElementById("li"+id)
        lc.style.display = "block"
        var current_form = document.getElementById('f'+id)
        var current_answer = document.getElementById('a'+id)
        var current_error = document.getElementById('e'+id)
        url = "https://stackoverflowgidraf.herokuapp.com/api/v1/update_answer/"+event.target.id
        fetch(url,{
          method:"PUT",
          body: JSON.stringify({answer_text:current_form.answer_text.value}),
          headers:{"content-type":"application/json; charset = UTF-8",
          "Authorization":"Bearer "+token
        }
      }).then(function (response){
        if (response.status === 200){
          lc.style.display = "none"
          current_answer.innerHTML = current_form.answer_text.value
          if(current_form.is_open){
            current_form.style.display = 'none'
            current_answer.style.display = 'block'
          }
        }
        else if (response.status === 400) {
          lc.style.display = "none"
          response.json().then(function (data){
            current_error.style.color = 'red'
            current_error.innerHTML = data["error"]
          })
        }
      })

      })
      if (answers[i]['is_answer']){
        answer_holder.style.background = "#A5D6A7"
        answer.style.background = "#81C784"
        accept_btn.style.display = "none"
      }

      if (question["userid"] != user["userid"]){
        accept_btn.style.display = "none"
      }
      edit_btn.addEventListener('click', function (){
        event.preventDefault();
        var current_form = document.getElementById('f'+ event.target.id)
        var current_answer = document.getElementById('a'+event.target.id)
        if(!current_form.is_open){
          current_answer.style.display ='none'
          current_form.style.display = 'block'
          current_form.is_open =true
        }
        else{
          current_answer.style.display ='block'
          current_form.style.display = 'none'
          current_form.is_open = false
        }

      })
      answers_labels.appendChild(answer_username);
      answers_labels.appendChild(votes_labels);
      answers_labels.appendChild(accept_btn)
      answers_labels.appendChild(loading_image)
      answers_labels.appendChild(clear);
      answers_labels.appendChild(br);
      answers_labels.appendChild(time);
      answers_labels.appendChild(edit_control);
      answers_labels.appendChild(votes_container);
      answer_holder.appendChild(answers_labels);
      answer_holder.appendChild(clear);
      answer_holder.appendChild(form)
      answer_holder.appendChild(answer);
      answer_holder.appendChild(clear);
      forum_content.appendChild(answer_holder);
    }
  });
  }
  else if (response.status === 401) {
    alert("You need to login first");
    window.location.href = "signin.html";
  }
  else if (response.status === 404 || response.status === 400) {
    response.json().then(function (data){
      alert(data["error"]);
      loader.style.display = "none"
    });
  }
});
}

// decode token
function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
};

function post_answer (event){
  event.preventDefault();
  var id = localStorage.getItem('id')
  answerForm = document.getElementById('answerForm');
  loader.style.display = "block"
  data =JSON.stringify({answer_text:answerForm.answer.value});
  url = "https://stackoverflowgidraf.herokuapp.com/api/v1/answers/"+id;

  fetch(url,{
    method:"POST",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
  }
).then(function (response){
  if(response.status === 201){
    response.json().then(function(data){
      answerForm.answer.value =""
      error = document.getElementById('error');
      error.innerHTML = ""
      while (forum_content.firstChild) {
        forum_content.removeChild(forum_content.firstChild)
      }
      get_question_details()
      loader.style.display = "none"
    });
  }
  else if (response.status === 400) {
    response.json().then(function (data){
      error = document.getElementById('error');
      error.style.display = 'block';
      error.innerHTML = data["error"];
      loader.style.display = "none"
    });
  }
});
}

function delete_answer(event){
  event.preventDefault()
  url ="https://stackoverflowgidraf.herokuapp.com/api/v1/delete_answer/"+event.target.id
  var current_answer_holder = document.getElementById('ah'+ event.target.id)
  fetch(url,{
    method:"DELETE",
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
  }
).then(function(response){
  if(response.status === 200){
    forum_content.removeChild(current_answer_holder)
  }
})
}

// upvote answer

function upvote_answer(event){
  event.preventDefault();
  id = event.target.answerid
  loader.style.display = "block"
  url = url ="https://stackoverflowgidraf.herokuapp.com/api/v1/upvote/"+id
  data = JSON.stringify({})
  fetch(url,{
    method:"PATCH",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function(response){
  if (response.status === 200)
  while (forum_content.firstChild) {
    forum_content.removeChild(forum_content.firstChild)
  }
  get_question_details()
  loader.style.display = "none"
})
}

function downvote_answers(event){
  event.preventDefault();
  id = event.target.answerid
  url = url ="https://stackoverflowgidraf.herokuapp.com/api/v1/downvote/"+id
  data = JSON.stringify({})
  fetch(url,{
    method:"PATCH",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer " + token
  }
}).then(function(response){
  if (response.status === 200)
  while (forum_content.firstChild) {
    forum_content.removeChild(forum_content.firstChild)
  }
  get_question_details()
})
}

function mark_as_prefered(event){
  event.preventDefault();
  loader.style.display= "block"
  id = event.target.id
  url = url ="https://stackoverflowgidraf.herokuapp.com/api/v1/mark_answer/"+id
  var data = JSON.stringify({})
  fetch(url,{
    method:"PATCH",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer " + token
  }
}).then(function(response){
  if (response.status === 200)
  while (forum_content.firstChild) {
    forum_content.removeChild(forum_content.firstChild)
  }
  get_question_details()
  loader.style.display = "none"
})
}
}
else {
  window.location.href ='signin.html'
}
