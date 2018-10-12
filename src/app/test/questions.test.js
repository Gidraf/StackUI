var questions = require("./mockfiles/question_script")


test("get_questions should not be undefined", () => {
  expect(questions.get_questions()).not.toBe(undefined)
})

test("post_questions should not be undefined",()=>{
  data = JSON.stringify({username:"name",useremail:"email@email.com",password:"password"})
  expect(questions.post_question(data)).not.toBe(undefined)
})
