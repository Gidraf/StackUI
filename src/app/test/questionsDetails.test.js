var questionDetails = require("./mockfiles/question_details_script");

test("get_questions_details should not be undefined", ()=>{
  console.log(questionDetails.get_question_details(1));
  expect(questionDetails.get_question_details(1)).not.toBe(undefined)
})

test("post answer should not be undefined", () => {
  data = JSON.stringify({answer_text:"this this this this"});
  expect(questionDetails.post_answer(data)).not.toBe(undefined);
})

test("delete answer should not be null",() => {
  expect(questionDetails.delete_answer(1)).not.toBe(undefined);
})

test("update answer should not be undefined", () => {
  data = JSON.stringify({answer_text:"hithihthgf gfjng"});
  expect(questionDetails.update_answer(1, data)).not.toBe(undefined);
})

test("upvote answer should not be undefined", () =>{
  expect(questionDetails.upvote_answer(1)).not.toBe(undefined);
})

test("down vote answer should not be undefined", () =>{
  expect(questionDetails.downvote_answers(1)).not.toBe(undefined);
})

test("get_answer_comments should not be undefined", () => {
  var comment_holder = document.createElement("div")
  expect(questionDetails.get_answer_comments(comment_holder, 1)).not.toBe(undefined);
})

test("post coomment should not be undefined", () => {
  data = JSON.stringify({comment_text:"coommenrnfs cskmnnsckns sdknfd fnekd "})
  expect(questionDetails.post_comment(1, data)).not.toBe(undefined)
})

test("accept answer should not be undefined", () =>{
  expect(questionDetails.mark_as_prefered(1)).not.toBe(undefined)
})

// test("get answer votes should not be null",() =>{
//   expect(questionDetails.get_votes()).not.toBe(null)
// })
