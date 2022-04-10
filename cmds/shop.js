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
  stands: [],
  bussy: false
}

const buyPrices = {
  arrow: 500,
  reqArrow: 1000
}

buy = (msg, args) => {
  userDB.get(msg.author.id).then(user => {
    if (!user || user.length < 1) {
      userDB.set(msg.author.id, userExample)
      msg.channel.send(`You do not have any stardust 😯`)
    } else {
      const quantity = isNaN(args[2]) ? 1 : parseInt(args[2])
      if (quantity <= 0) return msg.channel.send("You must enter a correct amount to buy!")
      switch (args[1]) {
        case 'arr':
        case 'arrow':
          buyArrow(msg, user, quantity)
          break
        case 'req':
        case 'requiem':
          buyReqArrow(msg, user, quantity)
          break
        default: msg.channel.send("Check shop for items you can buy")
      }
    }
  })
}

function buyArrow(msg, user, quantity) {
  if (user.stardust < buyPrices.arrow * quantity) return msg.channel.send(`You need **${buyPrices.arrow * quantity} ⭐stardust⭐** to buy this 😥`)
  if(user.bussy) return msg.channel.send("You are bussy on another transaction")
  user.stardust -= buyPrices.arrow * quantity
  user.arrows += quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Succesfully purchased ${quantity} arrow${quantity == 1 ? "" : "s"}✌`)
}

function buyReqArrow(msg, user, quantity) {
  if (user.stardust < buyPrices.reqArrow * quantity) return msg.channel.send(`You need **${buyPrices.reqArrow * quantity} ⭐stardust⭐** to buy this 😥`)
  user.stardust -= buyPrices.reqArrow * quantity
  user.reqArrows += quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Succesfully purchased ${quantity} requiem arrow${quantity == 1 ? "" : "s"}✌`)
}
//-------------------------------------------------------------------------------------------------
const sellPrices = {
  arrow: 250,
  reqArrow: 500
}

sell = (msg, args) => {
  userDB.get(msg.author.id).then(user => {
    if (!user || user.length < 1) {
      userDB.set(msg.author.id, userExample)
      msg.channel.send(`You do not have anything to sell 😯`)
    } else {
      const quantity = isNaN(args[2]) ? 1 : parseInt(args[2])
      if (quantity <= 0) return msg.channel.send("You must enter a correct amount to sell!")
      switch (args[1]) {
        case 'arr':
        case 'arrow':
          sellArrow(msg, user, quantity)
          break
        case 'req':
        case 'requiem':
          sellReqArrow(msg, user, quantity)
          break
        case "st":
        case "stand":
          args.shift()
          args.shift()
          console.log(args)
          sellStand(msg, user, args)
          break
        default: msg.channel.send("Check shop for items you can sell")
      }
    }
  })
}

function sellArrow(msg, user, quantity) {
  if (user.arrows < quantity) return msg.channel.send(`You do not have that many arrows 😥`)
  user.arrows -= quantity
  user.stardust += sellPrices.arrow * quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Successfully sold ${quantity} arrow${quantity == 1 ? "" : "s"}✌`)
}

function sellReqArrow(msg, user, quantity) {
  if (user.reqArrows < quantity) return msg.channel.send(`You do not have that many arrows 😥`)
  user.reqArrows -= quantity
  user.stardust += sellPrices.arrow * quantity
  userDB.set(msg.author.id, user)
  msg.channel.send(`Successfully sold ${quantity} requiem arrow${quantity == 1 ? "" : "s"}✌`)
}

function sellStand(msg, user, args) {
  if (args.length < 1) return msg.channel.send("You must specify the stand name you are willing to sell")
  if (user.stands.length < 1) return msg.channel.send("You do not have any stands 😲")
  args = args.join(' ')
  var index = user.stands.map(x => x.name.toLowerCase()).indexOf(args)
  if (index == -1) return msg.channel.send("You do not own that stand or misspelled the name 🤔")
  if(user.bussy) return msg.channel.send("You are bussy on another transaction")
  var stand = user.stands.splice(index, 1)[0]
  user.stardust += stand.stardust
  userDB.set(msg.author.id, user)
  return msg.channel.send(`Successfully sold **${stand.name}** for **${stand.stardust} ⭐Stardust⭐**`)
}

shop = msg => {
  return msg.channel.send({ embeds: [shopEmbed], files: ['/home/runner/Silver-Chariot/images/bags.png'] })
}

const shopEmbed = new MessageEmbed()
  .setColor('#ffa701')
  .setTitle(`Shop`)
  .setDescription("Commands:\n**buy <item> <amount>**\n**sell <item> <amount>**\n**sell stand <stand name>**\n")
  .setImage('attachment://bags.png')

module.exports = { sell, buy, shop }