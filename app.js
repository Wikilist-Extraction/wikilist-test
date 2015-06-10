/*=== Main Application ===*/
var express = require('express')
  , http = require('http')
  , bodyParser = require('body-parser')
  , app = express()
  , router = express.Router()
  , http_port = 3000
  , args = process.argv.splice(2);

var Utils = require("./middleware/Utils");

app.use(express.static(__dirname + '/public'));

router.use(bodyParser.json());
router.use(Utils.fiberRoutes);

require("./db/db").once('open', function callback() {
	/*=== insert routes here ===*/
	require("./all.routes")(router);
});
app.use("/api", router);

app.listen(args[0] || http_port);
console.log("Listening on " + http_port);
