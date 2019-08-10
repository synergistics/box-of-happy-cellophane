const url = require('url')
const ws = require('ws')

const Discord = require('discord.js')
// const speech = require('speaktome-node')
const webdriver = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')

const auth = require('./auth.json')

const port = process.env.PORT || 8080
const wss = new ws.Server({ port })

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log('server', message)
    }) 
})


const bot = new Discord.Client();

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    let channel = bot.channels.find(ch => ch.name === 'general')
    channel.send("poll: {title} [option 1] [option 2] [option 3]")
    // channel.send('pm!cmd -q "test" -l "test" -o "a,b,c"')
    // speech.record().then(results => {
    //     channel.send(results.text)    
    // })
})

bot.on('message', message => {
    if (message.author.bot) return;

    // try to see if message is URL
    try { var url = new URL(message.content) }
    catch (error) { console.log(`"${message.content}" is not a url`) }
    
    if (url) {
        for (let client of wss.clients) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({ type: 'open', url }))
            }
        }
    }
    else if (message.content.substring(0,3) === '!we') {
        let args = message.content.split(/\s+/).slice(1)
        // console.log(args)
        let command = args[0]
        if (command === 'close') {
            for (let client of wss.clients) {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({ type: 'close', url: args[1] }))
                }
            }
        }
        else if (command === 'clear') {
            for (let client of wss.clients) {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({ type: 'clear' }))
                }
            }
        }
    }

    // if (message.content.indexOf('!') === 0) {
    //     let text = message.content.substring(1);

    //     let reversed = ''
    //     let i = text.length
    //     while (i > 0) {
    //         reversed += text.substring(i-1, i)
    //         i--;
    //     }

    //     message.reply(reversed)
    // }
})

bot.login(auth.token)
    .catch(err => console.log("oops"))

// async function example() {
//   let driver = await new Builder().forBrowser('firefox').build();
//   try {
//     await driver.get('http://www.google.com/ncr');
//     await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
//     await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
//   } finally {
//     // await driver.quit();
//   }
// }

// example();
