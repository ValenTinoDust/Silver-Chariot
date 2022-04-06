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
  arrow: 250,
  reqArrow: 500
}

sell = (msg, args) => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(msg.author.id, userExample)
      msg.channel.send(`You do not have anything to sell 😯`)
    } else {
      const quantity = isNaN(args[2]) ? 1 : parseInt(args[2])
      if(quantity <= 0) return msg.channel.send("You must enter a correct amount to sell!")
      switch(args[1]){
        case 'arr':
        case 'arrow':
          arrow(msg, user, quantity)
          break
        case 'req':
        case 'requiem':
          reqArrow(msg, user, quantity)
          break
        case "st":
        case "stand":
          args.shift()
          args.shift()
          console.log(args)
          stand(msg, user, args)
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
  msg.channel.send(`Successfully sold ${quantity} arrow${quantity == 1 ? "" : "s"}✌`)
}

function reqArrow(msg, user, quantity){
  if(user.reqArrows < quantity) return msg.channel.send(`You do not have that many arrows 😥`)
  user.reqArrows -= quantity
  user.stardust += prices.arrow * quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Successfully sold ${quantity} requiem arrow${quantity == 1 ? "" : "s"}✌`)
}

function stand(msg, user, args){
  if(args.length < 1) return msg.channel.send("You must specify the stand name you are willing to sell")
  if(user.stands.length < 1) return msg.channel.send("You do not have any stands 😲")
  args = args.join(' ') 
  var index = user.stands.map(x => x.name.toLowerCase()).indexOf(args)
  if(index != -1){
    var stand = user.stands.splice(index, 1)[0]
    user.stardust += stand.stardust
    console.log(stand)
    userDB.set(msg.author.id, user)
    return msg.channel.send(`Successfully sold **${stand.name}** for **${stand.stardust} ⭐Stardust⭐**`)
  } else {
    return msg.channel.send("You do not own that stand or misspelled the name 🤔")
  }
}

module.exports = sell