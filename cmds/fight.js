const Database = require("@replit/database")
const userDB = new Database()
const { MessageEmbed } = require('discord.js')
//Async await 
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

async function fight (msg) {
  if(!msg.mentions.users.first()) return msg.channel.send("You must tag someone")
  if(msg.author.id == msg.mentions.users.first().id) return msg.channel.send("You cannot fight yourself")
  var user1 = await userDB.get(msg.author.id)
  if(!user1 || user1.stands.length == 0) return msg.channel.send("You have no stands to fight with")
  var user2 = await userDB.get(msg.mentions.users.first().id)
  if(!user2 || user2.stands.length == 0) return msg.channel.send(`<@${msg.mentions.users.first().id}> has no stands to fight with`)
  try {
    await consent(msg)
  } catch (e) {
    return msg.channel.send("Fight cancelled")
  }
  msg.channel.send({embed: [fightEmbed()]})
  //Make it automatic fights that autoedit every 1 or 2 secs
  //block chances, critical hit chances, and when block doesnt work
  //substract from health equal to the ATK * critical multiplier (if there is)
}

function consent (msg) {
  return new Promise(function(resolve, reject){
    msg.channel.send(`<@${msg.mentions.users.first().id}>, do you accept fight? **YES** or **NO**`)
    const filter = m => m.author.id == msg.mentions.users.first().id
    const collector = msg.channel.createMessageCollector({ filter: filter, time: 55000 })
    collector.on('collect', m => {
      if(m.content.toLowerCase() == "yes") return resolve()
      if(m.content.toLowerCase() == "no") collector.stop()
    })
    collector.on('end', (collected, reason) => {
      return reject()
    })
  })
}
/*
function fightEmbed(){
  return new MessageEmbed()
	.setColor('#FFBF00')
	.setTitle(`${}`)
	.setDescription(``)
	.setImage()
}
*/
module.exports = fight