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

give = (msg, args) => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      user = userExample
      userDB.set(msg.author.id, userExample)
      msg.channel.send(`You do not have anything to give 😯`)
    } else {
      if(!msg.mentions.users.first()) return msg.channel.send("You must tag someone")
      if(msg.mentions.users.first().id == msg.author.id) return msg.channel.send("You cannot give to yourself")
      switch(args[1]){
        case 'arr':
        case 'arrow':
          arrow(msg, user, isNaN(args[2]) ? 1 : parseInt(args[2]))
          break
        case 'req':
        case 'requiem':
          reqArrow(msg, user, isNaN(args[2]) ? 1 : parseInt(args[2]))
          break
        case 'st':
        case 'stand':
          stand(msg, user, args)
          break
        case 'stardust':
          stardust(msg, user, isNaN(args[2]) ? 0 : parseInt(args[2]))
          break
        default: msg.channel.send("You have to pick something to give")
      }
    }
  })
}

function stardust(msg, user, quantity){
  if(quantity < 1) return msg.channel.send("You must specify a correct amount")
  if(user.stardust < quantity) return msg.channel.send("You do not have enough **⭐Stardust⭐**")
  userDB.get(msg.mentions.users.first().id).then( target => {
    if(!target) target = userExample
    user.stardust -= quantity
    target.stardust += quantity
    userDB.set(msg.author.id, user)
    userDB.set(msg.mentions.users.first().id, target)
    return msg.channel.send(`Successfully given **${quantity} ⭐ stardust ⭐** to <@${msg.mentions.users.first().id}>`)
  })
}

function arrow(msg, user, quantity){
  if(quantity < 1) return msg.channel.send("You must specify a correct amount")
  if(user.arrows < quantity) return msg.channel.send(`You do not have enough **arrows**`)
  userDB.get(msg.mentions.users.first().id).then( target => {
    if(!target) target = userExample
    user.arrows -= quantity
    target.arrows += quantity
    userDB.set(msg.author.id, user)
    userDB.set(msg.mentions.users.first().id, target)
    return msg.channel.send(`Successfully given **${quantity} arrow${quantity > 1 ? s : ""}** to <@${msg.mentions.users.first().id}>`)
  })
}

function reqArrow(msg, user, quantity){
  if(quantity < 1) return msg.channel.send("You must specify a correct amount")
  if(user.reqArrows < quantity) return msg.channel.send(`You do not have enough **requiem arrows**`)
  userDB.get(msg.mentions.users.first().id).then( target => {
    if(!target) target = userExample
    user.reqArrows -= quantity
    target.reqArrows += quantity
    userDB.set(msg.author.id, user)
    userDB.set(msg.mentions.users.first().id, target)
    return msg.channel.send(`Successfully given **${quantity} requiem arrow${quantity > 1 ? s : ""}** to <@${msg.mentions.users.first().id}>`)
  })
} 

function stand(msg, user, args){
  if(user.stands.length < 1) return msg.channel.send("You do not have any stands to give 😯")
  args.shift()
  args.shift()
  args.pop()
  args = args.join(' ')
  var index = user.stands.map(x => x.name.toLowerCase()).indexOf(args)
  if(index == -1) return msg.channel.send("You do not own that stand or misspelled the name 🤔")
  var stand = user.stands.splice(index, 1)[0]
  userDB.get(msg.mentions.users.first().id).then( target => {
    if(!target) target = userExample
    if(target.stands.map( x => x.id == stand.id)[0]) return msg.channel.send(`<@${msg.mentions.users.first().id}> already owns this stand`)
    target.stands.push(stand)
    userDB.set(msg.author.id, user)
    userDB.set(msg.mentions.users.first().id, target)
    return msg.channel.send(`Successfully given **${stand.name}** to <@${msg.mentions.users.first().id}>`)
  })
}

module.exports = give