const url = require('url')
const ws = require('ws')

const Discord = require('discord.js')
const opener = require("opener");
// const speech = require('speaktome-node')
const {Builder, By, Key, until} = require('selenium-webdriver')

const auth = require('./auth.json')

const wss = new WebSocket.Server({ port: process.env.PORT })

wss.on('connection', ws => {
    console.log('connected')    
})

const bot = new Discord.Client();

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    let channel = bot.channels.find(ch => ch.name === 'general')
    // speech.record().then(results => {
    //     channel.send(results.text)    
    // })
})

bot.on('message', message => {
    if (message.author.bot) return;

    // try to see if message is URL
    try {
        let url = new URL(message.content)
        opener(message.content) 
    } 
    catch (error) {
        console.log(error)
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

async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    // await driver.quit();
  }
}

example();
