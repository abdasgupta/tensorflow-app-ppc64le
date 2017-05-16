var express = require('express')
var app = express()
var shortid = require('shortid')
var imageName = shortid.generate()
var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, imageName+'.jpg')
  }
})
 
var upload = multer({ storage: storage })

const commandLineArgs = require('command-line-args')
 
const optionDefinitions = [
  { name: 'inception_client', alias: 'c', type: String },
  { name: 'server', alias: 's', type: String }]

const options = commandLineArgs(optionDefinitions)
ic = options.inception_client
server = options.server

console.log("Your inception client is:"+ ic)

var fs = require('fs');

app.get('/inception/pet', function (req, res) {
  res.sendFile(__dirname + "/index.html")
})

app.get('/petImage', function (req, res) {
  res.sendFile(__dirname + "/my-uploads/" + imageName + ".jpg")
})

app.post('/inception/pet', upload.single('petImage'), function (req, res) {
  var renderedText = '<html><head><title>Pet Classifier</title></head>'+
                     '<body>'+
                     '<h1>Your uploaded image</h1>'+
                     '<img src="/petImage" alt="Your Pet" width="600" height="400"/>'+
                     '<br/>'

  if (!fs.existsSync(ic)) {
    console.log('Not a valid path for inception client python file')
    renderedText += 'Not a valid path for tensorflow_serving directory'
    renderedText += '</body></html>'
    res.send(renderedText)
  } else {
    const spawn = require('child_process').spawn;
    const inception = spawn("python", [ic, '--server',server, '--image', __dirname + "/my-uploads/" + imageName + ".jpg"])

    inception.stdout.on('data', function(data) {
      renderedText += '<br/><h4>Your pet looks like: '
      renderedText += '<font face="Courier New" size="5" color="red">' + data + '</font>'
      renderedText += '</h4><br/>'
      renderedText += '</body></html>'
      res.send(renderedText)
    })

    inception.stderr.on('data', (data) => {
      console.log(`${data}`)
    })

    inception.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })
  }
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

