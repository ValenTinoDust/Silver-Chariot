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
  stands: []
}

const multiplier = {
  red: 2,
  black: 2,
  odd: 2,
  even: 2,
  halfA: 2,
  halfB: 2,
  
}
//0 = green, 1 = red, 2 = black
const numbers = [0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1]

function exampleRoulette(number, amount){
  return new MessageEmbed()
	.setColor('#013220')
	.setTitle(`Roulette`)
	.setDescription(`Bet: **${amount}**` + "\n" + `Result: **${number == undefined ? "?" : number }**` + "\n\n" + colorEmoji())
	//.setImage("https://pngimg.com/uploads/roulette/roulette_PNG41.png")
}

function colorEmoji(){
  var emojis = []
  for (let index = 0; index < 10; index++) {
    num = Math.floor(Math.random() * (3))
    emojis.push( num == 2 ? "⬛" : num == 1 ? "🟥" : "🟩" )
  }
  emojis = emojis.join("")
  return emojis
}

roulette = (msg, args) => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(target.id, userExample)
      return msg.channel.send("You do not have enough **⭐ stardust ⭐**")
    } else {
      const amount = isNaN(args[2]) ? 0 : parseInt(args[2])
      if(amount <= 0) return msg.channel.send("You must enter a correct amount to bet!")
      if(user.stardust < amount) return msg.channel.send("You do not have enough **⭐ stardust ⭐** 😥")
      user.stardust -= amount
      userDB.set(msg.author.id, user)
      switch(args[1]){
        case 'r':
        case 'red':
          red(msg, amount)
          break
        case 'b':
        case 'black':
          black(msg, amount)
          break
        default: 
          args[1] = isNaN(args[1]) ? -1 : parseInt(args[1])
          if(args[1] == -1) return msg.channel.send("You have to pick a bet, **roulette <bet> <amount>**")
          if(args[1] >= 0 && args[1] <= 36) singleNumber(msg, amount)
          
      }
    }
  })
}

function red(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  const color = numbers[num]
  msg.channel.send({embeds: [exampleRoulette("?", amount)]}).then( embedMessage => {
    let count = 0
    const interval =  setInterval( () => {
      count++
      embedMessage.edit({embeds: [exampleRoulette("?", amount)]})
      if(count >= 8) {
        embedMessage.edit({embeds: [exampleRoulette(`${num} ${color == 2 ? "⬛" : color == 1 ? "🟥" : "🟩"}`, amount)]})
        if(color == 1) {
          userDB.get(msg.author.id).then( user => {
            user.stardust += amount * multiplier.red
            userDB.set(msg.author.id, user)
            msg.channel.send(`Congratulations, you earned **${amount * multiplier.red} ⭐ stardust ⭐**`)
          })
        } else msg.channel.send("Better luck next time! 🍀")
        clearInterval(interval)
      }
    }, 2000)
  })
}

module.exports = { roulette }