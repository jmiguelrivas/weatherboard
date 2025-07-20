const ws = new WebSocket('ws://localhost:3000')

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (message.type === 'weather') {
    updateUI(message.data)
  }
}
