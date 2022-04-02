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
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(msg.author.id, userExample)
      msg.channel.send(`Your total balance is **0 ⭐ stardust ⭐** 😯`)
    } else {
      msg.channel.send(`Your total balance is **${user.stardust} ⭐ stardust ⭐**`)
    }
  })
}

module.exports = balance