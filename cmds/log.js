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

log = (msg, args) => {
  target = msg.mentions.first ? msg.mentions.first : msg.author
  userDB.get(target.id).then(user => {
    if(!user || user.length < 1){
      user = userExample
      userDB.set(target, user)
    }
    console.log(target, user)
  })
}

module.exports = log