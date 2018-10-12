// show all the question inforamtion
// require('es6-promise').polyfill();
// require('isomorphic-fetch');
var token = localStorage.getItem('token');
var id = localStorage.getItem("id")
var question_title
var loader = document.getElementById('loader')
var delete_modal = document.getElementById('delete_modal')
var delet_cancel_btn =  document.getElementById('delet_cancel_btn')
var loading_image = document.getElementById('loading_image')
var delete_title = document.getElementById('delete_title')
delete_modal.style.display = "none"
loading_image.style.display = "none"
var answerForm = document.getElementById('answerForm');

// populate

function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));}

class QuestionDetails{
// get question details

constructor(){

}

 get_question_details(id){
  var url = " https://stackoverflowgidraf.herokuapp.com/api/v1/answers/"+id
  return fetch(url,{
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
    title.innerHTML = question['title']
    description.innerHTML = question['description']
    var answers_list = data["answers"]
    var answers = answers_list.sort(function (a, b){
      return (b-a)
    })
    var forum_content = document.getElementById('forum_content')
    for (var i=0;i<answers.length;i++){
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
      var comments_holder = document.createElement('div')
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
      delete_btn.className = 'answer_delete'
      delete_btn.style.opacity = 1;
      delete_btn.innerHTML = 'Delete'
      delete_btn.href = '#'
      delete_btn.id = answers[i]["answerid"]
      delete_btn.addEventListener('click',questionDetails.open_delete_modal)
      edit_btn.href = '#'
      edit_btn.id = answers[i]['answerid']
      edit_btn.innerHTML = 'Edit'
      edit_btn.style.opacity = 1;
      edit_btn.className = 'answer_edit'
      accept_btn.className = " accept "
      accept_btn.href ="#"
      accept_btn.innerHTML = " Accept "
      accept_btn.style.color = "green"
      accept_btn.id =answers[i]["answerid"]
      accept_btn.addEventListener('click',(event) =>{
        var id = event.target.id
        questionDetails.mark_as_prefered(id)
      })
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
      upvote.id ="u" + answers[i]["answerid"]
      upvote.addEventListener("click",questionDetails.upvote_current_answer)
      downvote.answerid = answers[i]["answerid"]
      downvote.id = "d" + answers[i]["answerid"]
      downvote.addEventListener("click",questionDetails.downvote_current_answers)
      downvote.innerHTML = "downvote";
      answer_username.innerHTML = answers[i]['username'];
      votes_labels.id = "v" + answers[i]['answerid'];
      time.innerHTML = answers[i]['time_created'];
      votes_container.appendChild(upvote);
      votes_container.appendChild(downvote);
      answer.innerHTML = answers[i]['answer_text'];
      update.addEventListener("click",function(event){
        event.preventDefault();
        id = event.target.id
        var current_form = document.getElementById('f'+id)
        var current_answer = document.getElementById('a'+id)
        var current_error = document.getElementById('e'+id)
        data = JSON.stringify({answer_text:current_form.answer_text.value})
        questionDetails.update_answer(id, data)

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
      questionDetails.get_answer_comments(comments_holder, answers[i]['answerid'])
      questionDetails.get_votes(answers[i]["votes"], votes_labels, upvote, downvote)
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
      answer_holder.appendChild(br)
      answer_holder.appendChild(br)
      answer_holder.appendChild(comments_holder);
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
      loader.style.display = "none";
    });
  }
});
}

update_answer(id,data){
  var lc = document.getElementById("li"+id)
  lc.style.display = "block"
  var url = " https://stackoverflowgidraf.herokuapp.com/api/v1/update_answer/"+id
  return fetch(url,{
    method:"PUT",
    body: data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function (response){
  if (response.status === 200){
    lc.style.display = "none"
    var current_answer = document.getElementById('a'+id)
    var current_form = document.getElementById('f'+ id)
    current_answer.innerHTML = current_form.answer_text.value
    if(current_form.is_open){
      current_form.style.display = 'none'
      current_answer.style.display = 'block'
    }
  }
  else if (response.status === 400) {
    lc.style.display = "none"
    response.json().then(function (data){
      var current_error = document.getElementById('e'+id)
      current_error.style.color = 'red'
      current_error.innerHTML = data["error"]
    })
  }
})
}
// decode token

post_answer (data){
  var id = localStorage.getItem('id');
  loader.style.display = "block";
  var url = " https://stackoverflowgidraf.herokuapp.com/api/v1/answers/"+id;
  return fetch(url,{
    method:"POST",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
  }
).then(function (response){
  if(response.status === 201){
    response.json().then(function(data){
      answerForm.answer.value ="";
      var error = document.getElementById('error');
      error.innerHTML = ""
      while (forum_content.firstChild) {
        forum_content.removeChild(forum_content.firstChild);
      }
      questionDetails.get_question_details(id)
      loader.style.display = "none";
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

open_delete_modal (event){
  event.preventDefault();
  var delete_btn = document.getElementById('delete_btn')

  delete_btn.answerid = event.target.id;
  delete_modal.style.display = "block";
  delete_btn.addEventListener("click",questionDetails.delete_current_answer);
}

close_delete_modal(){
  delete_title.textContent = "Are sure you want to delete!!";
  delete_modal.style.display = "none"

}

delete_current_answer(e){
  questionDetails.delete_answer(e.target.answerid)
}

delete_answer(id){
  loading_image.style.display = "inline"
  var url =" https://stackoverflowgidraf.herokuapp.com/api/v1/delete_answer/"+id
  var current_answer_holder = document.getElementById('ah'+ id)
  return fetch(url,{
    method:"DELETE",
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
  }
).then(function(response){
  if(response.status === 200){
    loading_image.style.display = "none"
    delete_title.textContent = "Deleted!!"
    window.setTimeout(questionDetails.close_delete_modal,1500)
    forum_content.removeChild(current_answer_holder)
  }
})
}

// upvote answer

upvote_current_answer(event){
  // should call the functions for upvoting the answer
  var answeid = event.target.answerid;
  questionDetails.upvote_answer(answeid);
}

upvote_answer(answerid){
  var id = event.target.answerid
  loader.style.display = "block"
  var url = url =" https://stackoverflowgidraf.herokuapp.com/api/v1/upvote/"+answerid
  var data = JSON.stringify({})
  return fetch(url,{
    method:"PATCH",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer "+token
  }
}).then(function(response){
  if (response.status === 200)
  {
    while (forum_content.firstChild) {
    forum_content.removeChild(forum_content.firstChild)
  }
  var id =localStorage.getItem("id")
  questionDetails.get_question_details(id)
  loader.style.display = "none"
} else if (response.status == 400) {
  loader.style.display = "none"
  response.json().then((data) => {
    console.log(data);
  })
}
})
}

downvote_current_answers(event){
  // should call answer downvote
  var answerid = event.target.answerid;
  questionDetails.downvote_answers(answerid)
}

downvote_answers(answerid){
  loader.style.display = "block"
  var id = event.target.answerid
  var url = url =" https://stackoverflowgidraf.herokuapp.com/api/v1/downvote/"+answerid
  var data = JSON.stringify({})
  return fetch(url,{
    method:"PATCH",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer " + token
  }
}).then(function(response){
  if (response.status === 200){
    loader.style.display = "none"
    while (forum_content.firstChild) {
    forum_content.removeChild(forum_content.firstChild)
  }
  var id = localStorage.getItem("id");
  questionDetails.get_question_details(id)
}
else if (response.status == 400) {
  response.json().then((data) =>{
  })
}
})
}

mark_as_prefered(answerid){
  loader.style.display= "block"
  var url = " https://stackoverflowgidraf.herokuapp.com/api/v1/mark_answer/"+answerid
  var data = JSON.stringify({})
  return fetch(url,{
    method:"PATCH",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer " + token
  }
}).then(function(response){
  if (response.status === 200)
  {
    while (forum_content.firstChild) {
    forum_content.removeChild(forum_content.firstChild)
  }
  questionDetails.get_question_details(id);
  loader.style.display = "none";
}
else if (response.status === 401) {
  window.location.href ='signin.html';
}
})
}

get_votes (votes_list, votes_labels, upvote, downvote) {
      var  answer_votes = []
        downvote.style.display = "none";
        for (var v = 0; v < votes_list.length; v++){
          if (votes_list[v]["upvote"] === true){
          {
            if(votes_list[v]["vote_userid"] == user["userid"])
            upvote.style.display = "none";
            downvote.style.display = "inline";
            answer_votes.push(votes_list[v]);
          }
        }
      votes_labels.innerHTML = answer_votes.length + " votes ";
    }
    return votes_list
  }

  get_answer_comments(comments_holder, answerid){
    var url = "https://stackoverflowgidraf.herokuapp.com/api/v1/comments/"+answerid;
    var comment_title = document.createElement('h4')
    var comment_container = document.createElement('div');
    var comment_form = document.createElement('form');
    var comment_error = document.createElement('span')
    var comment_input = document.createElement('textarea');
    var comment_btn = document.createElement('button');
    comment_title.innerHTML = "Comments";
    comment_title.className = "comment_title";
    comment_input.name = "comment_input";
    comment_input.placeholder = "add a comment";
    comment_btn.innerHTML = "Comment";
    comment_error.className = "error";
    comment_btn.id = answerid;
    comment_form.onsubmit = "post_comment(event)";
    comment_btn.addEventListener("click",   function (event) {
        event.preventDefault();
        loader.style.display = "block";
        var id = event.target.id;
        var data = JSON.stringify({"comment_text":comment_input.value});
        questionDetails.post_comment(id,data, comment_error);
      });
    comment_form.appendChild(comment_input)
    comment_form.appendChild(comment_error)
    comment_form.appendChild(comment_btn)
    return fetch(url, {
      method:"GET",
      headers:{"content-type":"application/json; charset = UTF-8",
      "Authorization":"Bearer " + token
    }
  }
).then((response) => {
      if(response.status === 200){
        response.json().then((comments) =>{
          var data = comments["comments"]
          for (var k = 0; k<data.length; k++){
            var comment_labels =document.createElement('div');
            var comment_username = document.createElement('a');
            var comment_time = document.createElement('span');
            var comment_text = document.createElement('p');
            comment_labels.className = "comment_labels";
            comment_username.href = "#";
            comment_username.innerHTML = data[k]["username"];
            comment_time.innerHTML = data[k]["comment_time"];
            comment_text.innerHTML = data[k]["comment_text"];
            comment_labels.appendChild(comment_username);
            comment_labels.appendChild(comment_time);
            comment_labels.appendChild(comment_text);
            comment_container.appendChild(comment_labels);
            comments_holder.appendChild(comment_container);
          }
        comments_holder.appendChild(comment_form);
        })
      }
      else if (response.status === 404) {
        comments_holder.appendChild(comment_form);
      }
    })
  }
post_comment(id, data, comment_error){
  var url = "https://stackoverflowgidraf.herokuapp.com/api/v1/add_comment/"+id;
  return fetch(url,{
    method:"POST",
    body:data,
    headers:{"content-type":"application/json; charset = UTF-8",
    "Authorization":"Bearer " + token
  }
}
).then((response) => {
    if(response.status === 201){
      loader.style.display = "none";
      comment_error.innerHTML = "";
      while (forum_content.firstChild) {
        forum_content.removeChild(forum_content.firstChild)
      }
      var id = localStorage.getItem("id")
      questionDetails.get_question_details(id)
    }
    else if (response.status === 400) {
      response.json().then((data) =>
    {
      loader.style.display = "none"
      comment_error.innerHTML = data["error"]
    }
  )
    }
  });

}
}

function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
};
var questionDetails = new QuestionDetails();
var user  = parseJwt(token)["identity"];
delet_cancel_btn.addEventListener("click",questionDetails.close_delete_modal);
questionDetails.get_question_details(id);
function post_answer(event){
event.preventDefault();
data = JSON.stringify({answer_text:answerForm.answer.value});
questionDetails.post_answer(data);
}

// module.exports = questionDetails;
