/*
    This javascript file will be ran in upgrade.sh. It's purpose is
    to change "script": "node index.js" in processes.json to
    "script": "node build/index.js"
*/

const Proc = require('./processes.json')
const fs = require('fs')

const dataToChange = JSON.parse(fs.readFileSync('./processes.json', 'utf-8'))
dataToChange.apps[0].script = 'node ./build/index.js'
fs.writeFileSync('./processes.json', JSON.stringify(dataToChange, null, 2))
