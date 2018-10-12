
//this module is intented to run web js script
//init ask_question modal
var question_modal =document.getElementById('question_modal')
var signup = document.getElementById('signup')
var token = localStorage.getItem('token')
error = document.getElementById('error')
update_error = document.createElement("update_error")
var ask_question=document.getElementById('ask_question');

if (token){
  signup.innerHTML = "Signout"
  signup.href = "signin.html"
  signup.addEventListener("click",logout)

}
else {
  signup.innerHTML = "Signin"
  signup.href = "signin.html"
  ask_question.style.display = "none"
}
// init downvote button
var downvote_btn = document.getElementById("votes");
var isopen=false;
// init ask questio button

var token = localStorage.getItem("token");
// init answers votes
var votes=0

// initialize the cancel button
var cancel=document.getElementById('cancel');

// display the question_modal when clicked
function open_model () {
  question_modal.classList.toggle('question_modal');
}

//closes the question_modal on cancel clicked
function close_modal(){
  question_modal.classList.toggle('question_modal');
  if (error != undefined || error != null)
  error.innerHTML = ""
  if(update_error != undefined || update_error != null )
  update_error.innerHTML = "";
};

//close the question_modal if the user closes otside the question_modal
window.onclick= function (event) {
  if(event.target == question_modal){
    question_modal.classList.toggle('question_modal');
  }
}

function logout(event){
  event.preventDefault();
  localStorage.removeItem('token')
  window.location.href = "signin.html"
}
