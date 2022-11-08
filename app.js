const express = require('express');
const morgan = require('morgan');
const timeout = require('connect-timeout'); //express v4
const helmet = require('helmet')
const cors = require('cors')
const http = require('http')
require('dotenv').config()

const client = require('./config/redis')

const h = require('./helpers/helper');
const router = require('./routes/router');

function haltOnTimedout(req, res, next){
    if (!req.timedout) next();
}

/**
 * Express Config
 */
let app = express();
app.disable('x-powered-by')
app.use(morgan('combined'));
app.use(express.json({limit:'20mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
// app.use('/static', express.static('uploads'))
// app.use('/assets', express.static('assets'))
// app.use('/file', express.static('assets/files'))
app.use(helmet())
// app.set('view engine', 'ejs')

const ctx = require('./config/constants');
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send(ctx.systemError())
})

/**
 * End Point Access
 */
// app.use(`/profiling/staging/v3`, router);
app.use('/', router);
app.use(timeout(300000));
app.use(haltOnTimedout);



/**
 * Run Server
 */
const port = 3030

// UNCOMMENT THIS FOR HTTPS RUN AFTER Certificate setup
// app.listen( port, () => {
//     console.log(`listening to ${port}`)
// })

let httpServer = http.createServer(app);
// let httpsServer = https.createServer(certificate, app);
httpServer.listen(port, () => {
    console.log(`listening on ${port}`);
});

/**
 * Execute Download Function
 */

client.on('connect', function() {
    console.log('redis connected to '+ process.env.REDIS_PORT );
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});
httpServer.timeout = 2147483647;
