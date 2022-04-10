const Database = require("@replit/database")
const userDB = new Database()

first = (msg, args) => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.stands.length < 2) return msg.channel.send("You have no stand to switch to!")
    args.shift()
    args = args.join(' ')
    var index = user.stands.map(x => x.name.toLowerCase()).indexOf(args)
    if(index == -1) return msg.channel.send("You do not own that stand or misspelled the name 🤔")
    if(user.bussy) return msg.channel.send("You are bussy on another transaction")
    stand = user.stands.slice(index)[0]
    user.stands.unshift(stand)
    userDB.set(msg.author.id, user)
    return msg.channel.send(`**${stand.name}** is now your primary stand`)
  })
}

module.exports = first