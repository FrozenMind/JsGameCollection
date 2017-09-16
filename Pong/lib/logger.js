var bunyan = require('bunyan')
//create logger --> warn and error is logged into a file
var log = bunyan.createLogger({
  name: 'Logger',
  streams: [{
    level: 'debug',
    stream: process.stdout
  }, {
    level: 'info',
    stream: process.stdout
  }, {
    level: 'warn',
    path: __dirname + '/../log/warn.log'
  }, {
    level: 'error',
    path: __dirname + '/../log/error.log'
  }]
})

module.exports = log
