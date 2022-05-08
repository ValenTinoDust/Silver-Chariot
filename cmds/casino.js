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

const multiplier = {
  red: 2,
  black: 2,
  odd: 2,
  even: 2,
  "1to18": 2,
  "19to36": 2,
  first: 3,
  second: 3,
  third: 3,
  single: 35
}
//0 = green, 1 = red, 2 = black
const numbers = [0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1]

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
      userDB.set(msg.author.id, userExample)
      return msg.channel.send("You do not have enough **⭐ stardust ⭐**")
    } else {
      const amount = isNaN(args[2]) ? 0 : parseInt(args[2])
      if(amount <= 0) return msg.channel.send("You have to pick a bet and amount, **roulette <bet> <amount>**")
      if(user.stardust < amount) return msg.channel.send("You do not have enough **⭐ stardust ⭐** 😥")
      if(user.bussy) return msg.channel.send("You are bussy on another transaction")
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
        case 'odd':
          odd(msg, amount)
          break
        case 'even':
          even(msg, amount)
          break
        case '1to18':
          _1to18(msg, amount)
          break
        case '19to36':
          _19to36(msg, amount)
          break
        case 'first':
          first(msg, amount)
          break
        case 'second':
          second(msg, amount)
          break
        case 'third':
          third(msg, amount)
          break
        default: 
          args[1] = isNaN(args[1]) ? -1 : parseInt(args[1])
          if(args[1] == -1) return msg.channel.send("You have to pick a bet, **roulette <bet> <amount>**")
          if(args[1] >= 0 && args[1] <= 36) singleNumber(msg, amount, args[1])
      }
    }
  })
}

function red(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, numbers[num] == 1 ? multiplier.red : 0, "red")
}

function black(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, numbers[num] == 2 ? multiplier.black : 0, "black")
}

function odd(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, (num%2) == 1 ? multiplier.odd : 0, "odd")
}

function even(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, (num%2) == 0 ? multiplier.even : 0, "even")
}

function _1to18(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, (num <= 18 && num >= 1) ? multiplier["1to18"] : 0, "1 to 18")
}

function _19to36(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, (num <= 36 && num >= 19) ? multiplier["19to36"] : 0, "19 to 36")
}

function first(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, (num <= 12 && num >= 1) ? multiplier.first : 0, "first third")
}

function second(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, (num <= 24 && num >= 13) ? multiplier.second : 0, "second third")
}

function third(msg, amount){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, (num <= 36 && num >= 24) ? multiplier.third : 0, "third third")
}

function singleNumber(msg, amount, target){
  const num = Math.floor(Math.random() * (37)) 
  embedController(msg, num, amount, num == target ? multiplier.single : 0, `${target}`)
}

function embedController(msg, num, amount, betReturn, target){
  const color = numbers[num]
  msg.channel.send({embeds: [exampleRoulette("?", amount, target)]}).then( embedMessage => {
    setTimeout( () => {
      embedMessage.edit({embeds: [exampleRoulette(`${num} ${color == 2 ? "⬛" : color == 1 ? "🟥" : "🟩"}`, amount, target)]})
      if(betReturn != 0) {
        userDB.get(msg.author.id).then( user => {
          user.stardust += amount * betReturn
          userDB.set(msg.author.id, user)
          msg.channel.send(`Congratulations, you earned **${amount * betReturn} ⭐ stardust ⭐**`)
        })
      } else msg.channel.send("Better luck next time! 🍀")
    }, 8000)
  })
}

function exampleRoulette(number, amount, target){
  return new MessageEmbed()
	.setColor('#013220')
	.setTitle(`Roulette`)
	.setDescription(`Bet: **${amount}** to ${target}` + "\n" + `Result: **${number == undefined ? "?" : number }**` + "\n\n" + colorEmoji())
}

casino = msg => {
  return msg.channel.send({ embeds: [casinoEmbed] })
}

const casinoEmbed = new MessageEmbed()
.setColor('#8b0000')
.setTitle(`Casino`)
.setDescription("Commands:\n**roulette <bet> <amount>**\n")

module.exports = { casino, roulette }