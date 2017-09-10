// init project
var express = require('express')
var json = require('body-parser').json
var app = express()

const { PORT = 3000,  VERIFY_TOKEN = "" } = process.env

app.get("/", (req, res) => {
  res.send('OK')
})

// Your service will get a post from Missions
app.post("/adder", json(), function (req, res) {
  // Find and create inputs array of numerals
  let inputs = req.body.input && req.body.input.filter(i => i.name && i.name.includes('numeral'))
  if (!inputs && inputs.length < 1) return res.status(412).send('adder input not found')  
  console.log(inputs.length + ' numerals received.')
  
  // Check if the verification token is valid
  var verify_token = req.get('x-verification');
  if (verify_token !== VERIFY_TOKEN) {
    let errMsg = 'Verification token does not match 🙅'
    console.log(errMsg)
    return res.status(403).send(errMsg)
  }

  let result = inputs.reduce(function(sum, input) {
    if (isNaN(input.value)) input.value = 0;
    return sum + parseInt(input.value)
  }, 0)

  console.log('result: ' + result)

  // Return something back to Missions as an output
  res.json({
    handled: true,
    output: {
      add_result: result
    }
  }) 
})

// Listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is 🎧  on port ' + listener.address().port)
})