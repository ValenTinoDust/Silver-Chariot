const Database = require("@replit/database")
const userDB = new Database()

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  lastStClaim: null,
  arrows: 0,
  reqArrows: 0,
  stands: []
}

const masterUserExample = {
  stardust: 999999999999999,
  lastClaim: null,
  lastDaily: null,
  lastStClaim: null,
  arrows: 999999999999999,
  reqArrows: 999999999999999,
  stands: []
}

userLog = (msg, args) => {
  if(!(msg.author.id == "932282133962182696")) return msg.channel.send("❌ **You are not authorised** ❌")
  target = msg.mentions.first ? msg.mentions.first : msg.author
  userDB.get(target.id).then(user => {
    if(!user || user.length < 1){
      user = userExample
      userDB.set(target.id, user)
    }
    console.log(target, user)
  })
}

resetUser = msg => {
  if(!(msg.author.id == "932282133962182696")) return msg.channel.send("❌ **You are not authorised** ❌")
  const target = msg.mentions.users.first() || msg.author;
  userDB.set(target.id, userExample)
  if(target == msg.author){
    msg.channel.send(`Your stats have been reset`)
  } else {
    msg.channel.send(`<@${target.id}>'s stats have been reset`)
  }
}

master = msg => {
  if(!(msg.author.id == "932282133962182696")) return msg.channel.send("❌ **You are not authorised** ❌")
  target = msg.mentions.users.first() ? msg.mentions.users.first() : msg.author
  userDB.get(target.id).then(user => {
    userDB.set(target.id, masterUserExample)
    return msg.channel.send("Given master template")
  })
}

module.exports = { log: userLog, reset: resetUser, master: master}