const Database = require("@replit/database")
const userDB = new Database()

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  arrows: 0,
  reqArrows: 0,
  stands: []
}

balance = msg => {
  const target = msg.mentions.users.first() || msg.author;
  userDB.set(target.id, userExample)
  if(target == msg.author){
    msg.channel.send(`Your stats have been reset`)
  } else {
    msg.channel.send(`<@${target.id}>'s stats have been reset`)
  }
}

module.exports = balance