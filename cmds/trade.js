const Database = require("@replit/database")
const { MessageEmbed } = require('discord.js')
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

trade = (msg, args) => {
  var user1
  var user2
  var index1
  var index2
  var stand1
  var stand2
  var onFirstCollector = true
  if(!msg.mentions.users.first()) return msg.channel.send("You need to mention someone, **trade <user> <stand>**")
  args.shift() // remove trade
  args.shift() //remove user
  args = args.join(" ") // join the stand name
  if(args.length == 0) return msg.channel.send("You need to name the stand you want to give, **trade <user> <stand>**")
  userDB.get(msg.author.id).then( user => {
    user1 = user
    if(!user1 || user1.stands.length == 0) return msg.channel.send("You do not own that stand or any others 😥")
    if(user1.bussy) return msg.channel.send("You are bussy on another transaction")
    index1 = user1.stands.map(x => x.name.toLowerCase()).indexOf(args)
    if(index1 == -1) return msg.channel.send("You do not own that stand or misspelles the name")
    user1.bussy = true
    userDB.set(msg.author.id, user1)
    msg.channel.send(`<@${msg.mentions.users.first().id}>, name the stand of yours you want to give or type **cancel** to reject the proposal`)
    const firstFilter = m => m.author.id == msg.mentions.users.first().id
    const firstCollector = msg.channel.createMessageCollector({ filter: firstFilter, time: 55000 })
    firstCollector.on('collect', m => {
      if(!onFirstCollector) return
      if(m.content.toLowerCase() == "cancel"){
        firstCollector.stop()
        secCollector.stop()
        return
      }
      userDB.get(m.author.id).then( user => {
        user2 = user
        if(!user2 || user2.stands.length == 0) return msg.channel.send("You do not own that stand or any others 😥")
        if(user2.bussy) return msg.channel.send("You are bussy on another transaction")
        index2 = user2.stands.map(x => x.name.toLowerCase()).indexOf(m.content.toLowerCase())
        if(index2 == -1) return msg.channel.send("You do not own that stand or misspelled the name")
        stand1 = user1.stands.splice(index1, 1)[0]
        stand2 = user2.stands.splice(index2, 1)[0]
        if(user2.stands.map(x => x.id).indexOf(stand1.id) != -1){
          user1.stands.splice(index1, 0, stand1)
          user2.stands.splice(index2, 0, stand2)
          return msg.channel.send(`<@${msg.mentions.users.first().id}> already owns that stand`)
        }
        if(user1.stands.map(x => x.id).indexOf(stand2.id) != -1){
          user1.splice(index1, 0, stand1)
          user2.splice(index2, 0, stand2)
          return msg.channel.send(`<@${msg.author.id}> already owns that stand`)
        }
        user2.bussy = true
        userDB.set(m.author.id, user2)
        msg.channel.send(`<@${msg.author.id}>, do you accept? type **yes** or **no**`)
        onFirstCollector = false
        firstCollector.stop()
      })
    })
    const secFilter = m => m.author.id == msg.author.id
    const secCollector = msg.channel.createMessageCollector({ filter: secFilter, time: 55000 })
    secCollector.on('collect', m => {
      if(onFirstCollector) return
      if(m.content.toLowerCase() == "no"){
        secCollector.stop()
      } else if(m.content.toLowerCase() == "yes"){
        user1.stands.push(stand2)
        user2.stands.push(stand1)
        userDB.set(msg.author.id, user1)
        userDB.set(msg.mentions.users.first().id, user2)
        secCollector.stop()
      }
    })
    secCollector.on('end', event => {
      unbussy(msg, user1, user2)
      return msg.channel.send("Trade ended")
    })
  })
}

function unbussy(msg, user1, user2){
  if(user1){
    user1.bussy = false
    userDB.set(msg.author.id, user1)
  }
  if(user2){
    user2.bussy = false
    userDB.set(msg.mentions.users.first().id, user2)
  }
}

module.exports = trade