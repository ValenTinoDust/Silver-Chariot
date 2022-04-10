const Database = require("@replit/database")
const userDB = new Database()
const { MessageEmbed } = require('discord.js')

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

function exampleInv(target, user){
  return new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${target.username}'s inventory`)
	.setDescription(`Stardust: **${user.stardust}**`)
	.setThumbnail(target.displayAvatarURL())
	.addFields(
		{ name: 'Arrows:', value: user.arrows.toString(), inline: true },
		{ name: 'Requiem arrows:', value: user.reqArrows.toString(), inline: true },
    { name: 'Stands:', value: user.stands.length.toString(), inline: true },
    { name: 'Health discs:', value: user["h-discs"].toString(), inline: true },
    { name: 'ATK discs:', value: user["atk-discs"].toString(), inline: true },
	)
  .setImage(user.stands.length > 0 ? user.stands[0].imgURL : "attachment://empty.png")
}

inventory = msg => {
  const target = msg.mentions.users.first() || msg.author;
  userDB.get(target.id).then( user => {
    if(!user || user.length < 1){
      user = userExample
      userDB.set(target.id, userExample)
    }
    const embed = exampleInv(target, user)
    return msg.channel.send(user.stands.length == 0 ? {embeds: [embed], files: ['/home/runner/Silver-Chariot/images/empty.png']} : {embeds: [embed]})
  })
}

module.exports = inventory