const moment = require('moment')
const Logger = function () {}

Logger.prototype.info = function (logText) {
    console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Info: ${logText}`)
}

Logger.prototype.error = function (logText) {
    console.log(
        `[${moment().format('DD-MM-YYYY HH:mm:ss')}] Error: ${
            logText instanceof Error ? logText.message : logText
        }`
    )
}

module.exports = new Logger()
