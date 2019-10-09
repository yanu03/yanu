/*!
 *
 * Easy Order
 * 
 *
 */
const	config = require('./config.json');
const port = process.env.PORT || config.webserver.port;
const	express = require('express');
const	app = express();
const ejs = require('ejs');
const	http = require('http').Server(app);
const root = `${__dirname}/../`;

app.set('views', './views');
app.engine('ejs', ejs.renderFile);
app.use(express.static('./contents'));
app.use(express.static('./views'));

// Routes ======================================================================
require('./controllers/route.js')(app);


// Server listen
http.listen(port, function() {
  console.log('Easy Talk server running at ' + config.webserver.host + ':' + port);
});
