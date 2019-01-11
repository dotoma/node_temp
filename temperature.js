const express = require('express')
const app = express()
const port = 9000

var exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

app.get('/', (request, response) => {
    console.log("Connexion entrante.")
    execute("python /home/pi/temperatureToDB.py 14", (temperature) => {
	response.send(JSON.stringify({'temperature': temperature}))
    })
})

app.listen(port, (err) => {
    if (err) {
	return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})
