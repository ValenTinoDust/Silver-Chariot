const Database = require("@replit/database")
const userDB = new Database()
const { MessageEmbed } = require('discord.js')

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  arrows: 0,
  reqArrows: 0
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
	)
}

inventory = msg => {
  const target = msg.mentions.users.first() || msg.author;
  userDB.get(target.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(target.id, userExample)
    }
    const embed = exampleInv(target, (!user || user.length < 1) ? userExample : user)
    msg.channel.send({embeds: [embed]})
  })
}

module.exports = inventory