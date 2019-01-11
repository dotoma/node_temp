const express = require('express')
const app = express()
const mysql = require('mysql')


require('./config/config.js')
var exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};




function getLastDaysTemperatures(nb_days, cb){
        // Création de la connexion ici car ne peut servir qu'une seule fois

                if (gConfig.config_id == "development"){
                	cb(null, [{"DATE_METER": "2019-01-11 14:20:00",
                				"TEMPERATURE": 14.0}])
                } else if (gConfig.config_id == "production"){

        var con = mysql.createConnection({
                host: gConfig.BDD.host,
                user: gConfig.BDD.user,
                password: gConfig.BDD.pass
        })

        con.connect(function(err){
                if (err) throw err;
                console.log("Connected to database!");
                	con.query("select DATE_FORMAT(DATE_METER, '%Y-%m-%d %H:%i') as DATE_METER, TEMPERATURE from RASP.TEMPERATURE where DATE_METER > date(now() - interval " + nb_days + " day);", function(err, result){
                        if (err) throw err;
                        return cb(null, result)
                	})
        })
    }
}




app.get('/getTemperatures', function(req,res){
        let nb_days = gConfig.nb_jours_temperatures 
        getLastDaysTemperatures(nb_days, (err, dataTemp) => {
                if (dataTemp){
                        // return res.json(dataTemp)
                        return res.send(JSON.stringify(dataTemp))
                } else {
                        return null
                }
            })
})


app.get('/', (request, response) => {
    console.log("Connexion entrante.")
    execute("python /home/pi/temperatureToDB.py 14", (temperature) => {
	response.send(JSON.stringify({'temperature': temperature}))
    })
})


// Error Handler for 404 Pages
app.use(function(req, res, next) {
        console.log(req)
        var error404 = new Error('Route Not Found');
        error404.status = 404;
        next(error404);
});

module.exports = app;

app.listen(gConfig.node_port, (err) => {
    if (err) {
	return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${gConfig.node_port}`)
})
