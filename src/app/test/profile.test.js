var userDetails = require("./mockfiles/profile_script.js")

test("delete question should not be undefined", ()=>{
  expect(userDetails.delete_question(1)).not.toBe(undefined)
})

test("get_user_questions should not be equall to undefined", ()=>{
  expect(userDetails.get_user_questions(1)).not.toBe(undefined)
})

test("user login should not not be undefined", () =>{
  data = JSON.stringify({title:"hdfjdbfdnfbd fnd", description:"ndkfndfbnd f dfbdjbnfd f dbnf "})
  expect(userDetails.update_question(1,data)).not.toBe(undefined)
})
