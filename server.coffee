express = require('express')
app = express()
morgan  = require('morgan')
bodyParser = require('body-parser')
getRawBody = require('raw-body')
compress = require('compression')
cookieParser = require('cookie-parser')
serveStatic = require('serve-static')
request = require('request')
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

app.use '/assets', (req, res, next) =>
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Accept-Ranges","bytes")
  res.setHeader('Cache-Control', "public, max-age=#{daysInCache / 1000}")
  res.header("Expires",daysInCache)
  next()

port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL
mongoURLLabel = ""

if (mongoURL == null or mongoURL == undefined) and process.env.DATABASE_SERVICE_NAME
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
  unless mongoURL then return

  mongodb = require('mongodb')
  unless mongodb then return
  
  console.log("MONGODB URL",mongoURL)
  
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


app.use (req, res, next) =>
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Accept-Ranges","bytes")
  res.setHeader('Cache-Control', "public, max-age=#{daysInCache / 1000}")
  res.header("Expires",daysInCache)
  next()

app.get '/assets*', (req, res) ->
  if req.params?[0]
    path = req.params[0]
    request.get({url:"https://storage.googleapis.com/www.littfass.com#{path}",headers: {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': 'X-Requested-With'}}).pipe(res)
  else
    res.send("File not found.")

app.get '/api*', (req, res) ->
  if req.params?[0]
    res.send(req.params?[0])
  else
    res.send("Api not found.")


app.use (err, req, res, next) ->
  console.error(err.stack)
  res.status(500).send('Something bad happened!')

initDb (err) ->
  console.log('Error connecting to Mongo. Message:\n' + err)

app.listen(port, ip)
console.log('Server running on http://%s:%s', ip, port)

module.exports = app