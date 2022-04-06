const Database = require("@replit/database")
const userDB = new Database()

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  lastStClaim: null,
  arrows: 0,
  reqArrows: 0,
  stands: []
}

const prices = {
  arrow: 500,
  reqArrow: 1000
}

buy = (msg, args) => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(msg.author.id, userExample)
      msg.channel.send(`You do not have any stardust 😯`)
    } else {
      const quantity = isNaN(args[2]) ? 1 : parseInt(args[2])
      if(quantity <= 0) return msg.channel.send("You must enter a correct amount to buy!")
      switch(args[1]){
        case 'arr':
        case 'arrow':
          arrow(msg, user, quantity)
          break
        case 'req':
        case 'requiem':
          reqArrow(msg, user, quantity)
          break
        default: msg.channel.send("Check shop for items you can buy")
      }
    }
  })
}

function arrow(msg, user, quantity){
  if(user.stardust < prices.arrow * quantity) return msg.channel.send(`You need **${prices.arrow * quantity} ⭐stardust⭐** to buy this 😥`)
  user.stardust -= prices.arrow * quantity
  user.arrows += quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Succesfully purchased ${quantity} arrow${quantity == 1 ? "" : "s"}✌`)
}

function reqArrow(msg, user, quantity){
  if(user.stardust < prices.reqArrow * quantity) return msg.channel.send(`You need **${prices.reqArrow * quantity} ⭐stardust⭐** to buy this 😥`)
  user.stardust -= prices.reqArrow * quantity
  user.reqArrows += quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Succesfully purchased ${quantity} requiem arrow${quantity == 1 ? "" : "s"}✌`)
}

module.exports = buy