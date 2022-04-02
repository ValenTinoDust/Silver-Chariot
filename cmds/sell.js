const Database = require("@replit/database")
const userDB = new Database()

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  arrows: 0,
  reqArrows: 0
}

const prices = {
  arrow: 250,
  reqArrow: 500
}

sell = (msg, args) => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(msg.author.id, userExample)
      msg.channel.send(`You do not have anything to sell 😯`)
    } else {
      switch(args[1]){
        case 'arr':
        case 'arrow':
          arrow(msg, user, isNaN(args[2]) ? 1 : parseInt(args[2]))
          break
        case 'req':
        case 'requiem':
          reqArrow(msg, user, isNaN(args[2]) ? 1 : parseInt(args[2]))
          break
        default: msg.channel.send("Check shop for items you can sell")
      }
    }
  })
}

function arrow(msg, user, quantity){
  if(user.arrows < quantity) return msg.channel.send(`You do not have that many arrows 😥`)
  user.arrows -= quantity
  user.stardust += prices.arrow * quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Succesfully sold ${quantity} arrow${quantity == 1 ? "" : "s"}✌`)
}

function reqArrow(msg, user, quantity){
  if(user.reqArrows < quantity) return msg.channel.send(`You do not have that many arrows 😥`)
  user.reqArrows -= quantity
  user.stardust += prices.arrow * quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Succesfully sold ${quantity} requiem arrow${quantity == 1 ? "" : "s"}✌`)
}

module.exports = sell