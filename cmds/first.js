const Database = require("@replit/database")
const userDB = new Database()

first = (msg, args) => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.stands.length < 2) return msg.channel.send("You have no stand to switch to!")
    args.shift()
    args = args.join(' ')
    if (args.length == 0) return msg.channel.send("You must name the stand you want to put first")
    var index = user.stands.map(x => x.name.toLowerCase()).indexOf(args)
    if(index == -1) return msg.channel.send("You do not own that stand or misspelled the name 🤔")
    if(user.bussy) return msg.channel.send("You are bussy on another transaction")
    stand = user.stands[index]
    user.stands.splice(index, 1)
    user.stands.unshift(stand)
    userDB.set(msg.author.id, user)
    return msg.channel.send(`**${stand.name}** is now your primary stand`)
  })
}

module.exports = first