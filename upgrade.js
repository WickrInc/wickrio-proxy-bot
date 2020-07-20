/*
    This javascript file will be ran in upgrade.sh. It's purpose is
    to change "script": "node proxy-bot.js" in processes.json to
    "script": "node build/proxy-bot.js"
*/

const Proc = require('./processes.json')
const fs = require('fs')

var dataToChange = JSON.parse(fs.readFileSync('./processes.json', 'utf-8'))
dataToChange.apps[0].script = 'node ./build/proxy-bot.js'
fs.writeFileSync('./processes.json', JSON.stringify(dataToChange, null, 2))
