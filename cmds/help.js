const { MessageEmbed } = require('discord.js')

const help = msg => {
  msg.channel.send({ embeds: [helpEmbed()] })
}

function helpEmbed(){
  return new MessageEmbed()
	.setColor('#a9a9a9')
	.setTitle(`Commands`)
	.setDescription("**balance (bal)\ncasino\ndaily (d)\nclaim (c)\nfirst\ngive\ninventory (inv)\nshop\nbuy (b)\nsell (s)\nstands (st)\nstandlist (sl)\ntrade\nuse**")
  .setThumbnail("https://i.redd.it/qcxiuab18ik41.png")
}

module.exports = help