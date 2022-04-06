const Database = require("@replit/database")
var fs = require('fs')
const { MessageEmbed } = require('discord.js')

fs.readFile('/home/runner/Silver-Chariot/stands.json', 'utf8', function (err, data) {
  if (err) throw err
  stands = JSON.parse(data)
})

standlist = msg => {
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
    if(pages.length == 1) return
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
}

function exampleStand(stand){
  return new MessageEmbed()
	.setColor('#FFBF00')
	.setTitle(`${stand.name}`)
	.setDescription(`Stardust: **${stand.stardust}**`)
	.setImage(stand.imgURL)
}

module.exports = standlist