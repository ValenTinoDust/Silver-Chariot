const Database = require("@replit/database")
const userDB = new Database()
var fs = require('fs')
const { MessageEmbed } = require('discord.js')

var stands
fs.readFile('/home/runner/Silver-Chariot/stands.json', 'utf8', function (err, data) {
  if (err) throw err
  stands = JSON.parse(data)
})

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  arrows: 0,
  reqArrows: 0,
  stands: []
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
  if(user.arrows < quantity) return msg.channel.send(`You do not have enough arrows 😥`)
  user.arrows -= quantity
  userDB.set(msg.author.id, user)
  for (let index = 0; index < quantity; index++) {
    standReaction(msg, quantity)
  }
}

function standReaction(msg, quantity){
  var stand = stands[Math.floor(Math.random()*stands.length)]
  stand.stardust = Math.floor(Math.random() * ((stand.stardust + 500) - (stand.stardust - 500) + 1)) + (stand.stardust - 500)
  const embed = exampleStand(stand)
  msg.channel.send({embeds: [embed]}).then(embedMessage => {
    embedMessage.react('🏹')
    var target
    const filter = (reaction, user) => {
      if(user.id == 959517108281180230) return false
      target = user
      return reaction.emoji.name === '🏹'
    }
    const collector = embedMessage.createReactionCollector( { filter: filter }, { max: 1, time: 60000 })
    var count = 0
    collector.on('collect', (reaction, reactionCollector) => {
      if(count < 1){
        userDB.get(target.id).then( user => {
          if(user.stands){
            if(user.stands.length > 0){
              if(!user.stands.map( x => x.id == stand.id)) msg.channel.send("You already own this stand")
              else {
                count++
                user.stands.push(stand)
                userDB.set(target.id, user)
                collector.stop()
                return msg.channel.send(`<@${target.id}> has been pierced by an arrow and obtained **${stand.name}**!`)
              }
            } else {
              count++
              user.stands.push(stand)
              userDB.set(target.id, user)
              collector.stop()
              return msg.channel.send(`<@${target.id}> has been pierced by an arrow and obtained **${stand.name}**!`)
            }
          } else {
            count++
            user = userExample
            user.stands.push(stand)
            userDB.set(target.id, user)
            collector.stop()
            return msg.channel.send(`<@${target.id}> has been pierced by an arrow and obtained **${stand.name}**!`)
          }
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

module.exports = use