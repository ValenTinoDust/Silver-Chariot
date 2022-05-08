let eightball = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes definitely',
	'You may rely on it',
	'As I see it, yes',
	'Most likely',
	'Outlook good',
	'Yes',
	'Signs point to yes',
	'Reply hazy try again',
	'Ask again later',
	'Better not tell you now',
	'Cannot predict now',
	'Concentrate and ask again',
	'Don\'t count on it',
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful',
	'No way',
	'Maybe',
	'The answer is hiding inside you',
	'No',
	'Depends on the mood of the CS god',
	'||No||',
	'||Yes||',
	'Hang on',
	'It\'s over',
	'It\'s just the beginning',
	'Good Luck',
]

_8ball = msg => {
  return msg.channel.send(eightball[randomInt(0, (eightball.length - 1))])
}

function randomInt(min, max) { // min and max included 
  let num = Math.floor(
    Math.random() * (max - min + 1) + min
  )
  return num
}

module.exports = _8ball