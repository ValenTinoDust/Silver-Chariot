const Database = require("@replit/database")
const userDB = new Database()

const userExampleClaim = {
  stardust: 500,
  lastClaim: Date.now(),
  lastDaily: null,
  lastStClaim: null,
  arrows: 0,
  reqArrows: 0,
  "h-discs": 0,
  "atk-discs": 0,
  stands: [],
  bussy: false
}

const userExampleDaily = {
  stardust: 500,
  lastClaim: null,
  lastDaily: Date.now(),
  arrows: 0,
  reqArrows: 0,
  "h-discs": 0,
  "atk-discs": 0,
  stands: [],
  bussy: false
}

const timeout = 10800000 //ms in 3 hs
const timeoutDaily = 86400000 //ms in a day

claim = msg => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(msg.author.id, userExampleClaim)
      msg.channel.send('You earned **500 ⭐ stardust ⭐**')
    } else if(user.lastClaim == null || (-Date.now() + timeout + user.lastClaim) <= 0){
      if(user.bussy) return msg.channel.send("You are bussy on another transaction")
      user.stardust += 500
      user.lastClaim = Date.now()
      userDB.set(msg.author.id, user)
      msg.channel.send('You earned **500 ⭐ stardust ⭐**')
    } else {
      timeLeft = msToTime(-Date.now() + user.lastClaim + timeout).slice(1)
      msg.channel.send(`You have already claimed. Next claim in **${timeLeft}**`)
    }
  })
}

daily = msg => {
  userDB.get(msg.author.id).then( user => {
    if(!user || user.length < 1){
      userDB.set(msg.author.id, userExampleDaily)
      msg.channel.send('You earned **500 ⭐ stardust ⭐**')
    } else if(user.lastDaily == null || (-Date.now() + timeoutDaily + user.lastDaily) <= 0){
      if(user.bussy) return msg.channel.send("You are bussy on another transaction")
      user.stardust += 500
      user.lastDaily = Date.now()
      userDB.set(msg.author.id, user)
      msg.channel.send('You earned **500 ⭐ stardust ⭐**')
    } else {
      msg.channel.send(`You have already claimed your daily. Next daily in **${msToTime(-Date.now() + user.lastDaily + timeoutDaily)}**`)
    }
  })
}

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  return hours + " hours and " + minutes + " minutes ";
}

module.exports = {
  claim, daily
}