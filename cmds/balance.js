const Database = require("@replit/database")
const userDB = new Database()

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  lastStClaim: null,
  arrows: 0,
  reqArrows: 0,
  "h-discs": 0,
  "atk-discs": 0,
  stands: [],
  bussy: false
}

balance = msg => {
  const target = msg.mentions.users.first() || msg.author
  userDB.get(target.id).then( user => {
    if(!user || user.stardust == 0) return msg.channel.send(`<@${target.id}>'s total balance is **0 ⭐ stardust ⭐** 😯`)
    return msg.channel.send(`<@${target.id}>'s total balance is **${user.stardust} ⭐ stardust ⭐**`)
  })
}

module.exports = balance