const Database = require("@replit/database")
const userDB = new Database()
var fs = require('fs')
const { MessageEmbed } = require('discord.js')

var stands
fs.readFile('/home/runner/Silver-Chariot/stands.json', 'utf8', function (err, data) {
  if (err) throw err
  stands = JSON.parse(data)
})

const timeout = 3600000

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

use = (msg, args) => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(msg.author.id, userExample)
      msg.channel.send(`You do not have any items 😯`)
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
        default: msg.channel.send("You have to pick an item, **use <item> <quantity>**")
      }
    }
  })
}

function arrow(msg, user, quantity){
  if(quantity > 4) quantity = 4
  if(user.arrows < quantity) return msg.channel.send(`You do not have enough arrows 😥`)
  user.arrows -= quantity
  userDB.set(msg.author.id, user)
  for (var index = 0; index < quantity; index++) {
    standReaction(msg, quantity)
  }
}

function standReaction(msg, quantity){
  var stand = {...stands[Math.floor(Math.random()*stands.length)]}
  stand.stardust = randomInt(stand.stardust * 1.25, stand.stardust * 0.75)
  stand.strength = randomInt(stand.strength * 1.25, stand.strength * 0.75)
  stand.defense = randomInt(stand.defense * 1.25, stand.defense * 0.75)
  const embed = exampleStand(stand)
  msg.channel.send({embeds: [embed]}).then(embedMessage => {
    embedMessage.react('🏹')
    const filter = (reaction, user) => {
      if(user.id == 959517108281180230) return false
      return reaction.emoji.name === '🏹'
    }
    const collector = embedMessage.createReactionCollector( { filter: filter }, { max: 1, time: 60000 })
    var count = 0
    collector.on('collect', (reaction, target) => {
      if(count < 1){
        userDB.get(target.id).then( user => {
          if(!user) user = userExample
          if(user.lastStClaim == null || (Date.now() - user.lastStClaim) >= timeout) {
            if(user.stands.length > 0 && user.stands.map(x => x.id == stand.id).indexOf(true) != -1) return msg.channel.send("You already own this stand")
            count++
            user.lastStClaim = Date.now()
            user.stands.push(stand)
            userDB.set(target.id, user)
            collector.stop()
            return msg.channel.send(`<@${target.id}> has been pierced by an arrow and obtained **${stand.name}**!`)
          }
          timeLeft = msToTime(-Date.now() + user.lastStClaim + timeout)
          return msg.channel.send(`You have already claimed. Next stand claim in **${timeLeft}**`)
        })
      }
    })
  })
}

function exampleStand(stand){
  return new MessageEmbed()
	.setColor('#FFBF00')
	.setTitle(`${stand.name}`)
	.setDescription(`Stardust: **${stand.stardust}**`)
	.setImage(stand.imgURL)
}

function msToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  hours = hours % 24;

  return minutes + " minutes "
}

function randomInt(min, max) { // min and max included 
  let num = Math.floor(
    Math.random() * (max - min + 1) + min
  )
  return num
}

module.exports = use