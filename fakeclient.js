const ws = require('ws')

const socket = new ws('ws://happy-cellophane.herokuapp.com')
socket.onopen = () => {
    console.log('boyma')
}
