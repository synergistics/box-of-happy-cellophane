const ws = require('ws')
const webdriver = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')

const socket = new ws('ws://happy-cellophane.herokuapp.com')
// const socket = new ws('ws://localhost:8080')
socket.on('open', () => {
    console.log('boyma')
})

// map<url, list<driver>>
let driverMap = {} 
socket.on('message', message => {
    message = JSON.parse(message)
    
    if (message.type === 'open') {
        let options = new firefox.Options()
            .setPreference('media.autoplay.default', 0)
            // .windowSize({ height: 200, width: 900 })

        let driver = new webdriver.Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .build()

        try {
            driver.manage().window().setRect({ 
                width: randInt(200, 1920), 
                height: randInt(200, 1080),
                x: randInt(0, 960),
                y: randInt(0, 540),
            })

            driver.get(message.url)
                .catch(err => console.log(err))

            if (driverMap[message.url]) {
                driverMap[message.url].push(driver)
            }
            else {
                driverMap[message.url] = [driver]
            } 
            // let links = driver.findElements(webdriver.By.tagName('a'))
            //     .then(links => {
            //         let elementMap = {} 
            //         Promise.all(links.map(link => {
            //             elementMap[]
            //             link.getAttribute('href')
            //         }))
            //             .then(hrefs => {
            //                 ws.send(JSON.stringify({
            //                     type: 'hrefs',
            //                     hrefs,
            //                     driver: message.url,
            //                 }))
            //             })
            //     })
            // // .then(hrefs => console.log(hrefs))
            //     .catch(err => console.log(err))
            // driver.findElement(webdriver.By.className('ytp-large-play-button ytp-button')).click()
            // driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
            // driver.wait(until.titleIs('webdriver - Google Search'), 1000);
            console.log(driverMap)
        } catch (err) {
            console.log(err) 
        } 
    }
    else if (message.type === 'close') {
        console.log('got close')
        let driver = driverMap[message.url]
        if (driver) {
            driver.close()
            delete driverMap[message.url]
        }     
    }
    else if (message.type === 'clear') {
        Object.keys(driverMap).forEach(url => {
            driverMap[url].forEach(driver => driver.close())
        })
        driverMap = {}
    }
    // else if (message.type === 'visit') {
    //     let driver = driverMap[message.driver]
    //     try {
    //         driver.get(message.url)
    //         driverMap[message.url] = driver;
    //         delete driverMap[message.driver]
    //     } 
    // }
})

// function getHrefs(driver) {
//     let links = driver.findElements(webdriver.By.tagName('a'))
//         .then(links => {
//             let elementMap = {} 
//             Promise.all(links.map(link => {
//                 elementMap[]
//                 link.getAttribute('href')
//             }))
//                 .then(hrefs => {
//                     ws.send(JSON.stringify({
//                         type: 'hrefs',
//                         hrefs,
//                         driver: message.url,
//                     }))
//                 })
//         })
//         .catch(err => console.log(err))
// }

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
} 
