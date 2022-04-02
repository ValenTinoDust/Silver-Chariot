const Database = require("@replit/database")
const userDB = new Database()

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  arrows: 0,
  reqArrows: 0
}

balance = msg => {
  userDB.set(msg.author.id, userExample)
  msg.channel.send('Your stats have been reset')
}

module.exports = balance