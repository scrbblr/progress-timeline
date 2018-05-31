express = require('express')
app = express()
morgan  = require('morgan')
bodyParser = require('body-parser')
getRawBody = require('raw-body')
compress = require('compression')
cookieParser = require('cookie-parser')
serveStatic = require('serve-static')

secret = "White-quote-Ordain-Mmm-fairy-Vinyl-Sky-Dig-byron-lymph"
oneDay = 86400000
daysInCache = 14 * oneDay
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile)
app.use(compress({threshold:0,level:9}))
app.use(morgan('combined'))
app.use(cookieParser(secret))
app.use(bodyParser.json({limit: '200mb',extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}))
app.use(serveStatic(__dirname + '/public', { maxAge: daysInCache, index:false}))

port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
ip = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL
mongoURLLabel = ""

if (mongoURL == null) and process.env.DATABASE_SERVICE_NAME
  mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase()
  mongoHost = process.env[mongoServiceName + '_SERVICE_HOST']
  mongoPort = process.env[mongoServiceName + '_SERVICE_PORT']
  mongoDatabase = process.env[mongoServiceName + '_DATABASE']
  mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  mongoUser = process.env[mongoServiceName + '_USER']

  if mongoHost and mongoPort and mongoDatabase
    mongoURLLabel = mongoURL = 'mongodb://'
    if mongoUser and mongoPassword
      mongoURL += mongoUser + ':' + mongoPassword + '@'
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase

db = null
dbDetails = new Object()

initDb = (callback) ->
  if mongoURL == null then return

  mongodb = require('mongodb')
  if mongodb == null then return

  mongodb.connect mongoURL, (err, conn) ->
    if err
      callback(err)
      return

    db = conn
    dbDetails.databaseName = db.databaseName
    dbDetails.url = mongoURLLabel
    dbDetails.type = 'MongoDB'

    console.log('Connected to MongoDB at: %s', mongoURL)

app.get '/', (req, res) ->
  unless db
    initDb (err) ->
      if err then console.log(err)
  if db
    col = db.collection('counts')
    col.insert({ip: req.ip, date: Date.now()})
    col.count (err, count) ->
      if err
        console.log('Error running count. Message:\n' + err)
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails })
  else
    res.render('index.html', { pageCountMessage : null})

app.get '/pagecount', (req, res) ->
  unless db
    initDb (err)->
      console.log(err)
  if db
    db.collection('counts').count (err, count ) ->
      res.send('{ pageCount: ' + count + '}')
  else
    res.send('{ pageCount: -1 }')


app.use (err, req, res, next) ->
  console.error(err.stack)
  res.status(500).send('Something bad happened!')

initDb (err) ->
  console.log('Error connecting to Mongo. Message:\n' + err)

app.listen(port, ip)
console.log('Server running on http://%s:%s', ip, port)

module.exports = app