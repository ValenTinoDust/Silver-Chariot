const Database = require("@replit/database")
const { MessageEmbed } = require('discord.js')
const userDB = new Database()

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  arrows: 0,
  reqArrows: 0,
  stands: []
}

userStands = msg => {
  const target = msg.mentions.users.first() || msg.author
  var stands = []
  userDB.get(target.id).then( user => {
    if(!user || user.length < 1){
      user = userExample
    }
    if(user.stands.length < 1) return msg.channel.send(msg.mentions.users.first() ? `<@${target.id}> does not have any stands yet 😯` : "You do not have any stands 😯")
    stands = user.stands
    const pages = []
    for (i = 0; i < stands.length; i++){
      pages.push(exampleStand(stands[i]))
    }
    buttonList = [
      "◀",
      "▶"
    ]
    index = 0
    msg.channel.send({embeds: [pages[index]]}).then(embedMessage => {
      embedMessage.react("◀")
      embedMessage.react("▶")
      const filter = (reaction, user) => {
        if(user.id == 959517108281180230) return false
        user = user
        return reaction.emoji.name === '◀' || reaction.emoji.name === '▶'
      }
      const collector = embedMessage.createReactionCollector( { filter: filter }, { max: 10, time: 60000, dispose: true })
      collector.on("collect", (reaction, user) => {
        if(reaction.emoji.name === '▶'){
          embedMessage.reactions.resolve("▶").users.remove(user.id)
          if((index + 1) > (pages.length - 1)) index = 0
          else index++
          embedMessage.edit({ embeds: [pages[index]] })
        } else {
          embedMessage.reactions.resolve("◀").users.remove(user.id)
          if((index - 1) < 0) index = pages.length - 1
          else index--
          embedMessage.edit({ embeds: [pages[index]] })
        }
      })
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

module.exports = userStands