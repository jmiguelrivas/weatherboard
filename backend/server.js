import http from 'http'
import { WebSocketServer } from 'ws'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.WEATHER_API_KEY

const server = http.createServer()
const wss = new WebSocketServer({ server })
let lastWeather = null

async function fetchWeather() {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Spokane,US&units=imperial&appid=${API_KEY}`
  )

  if (!res.ok) {
    const text = await res.text()
    console.error('Bad response:', res.status, text)
    return null
  }

  return res.json()
}

async function pollWeather() {
  try {
    const data = await fetchWeather()
    if (JSON.stringify(data) !== JSON.stringify(lastWeather)) {
      lastWeather = data
      broadcast({ type: 'weather', payload: data })
    }
  } catch (err) {
    console.error('Failed to fetch weather:', err)
  }
}

function broadcast(message) {
  const str = JSON.stringify(message)
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(str)
    }
  })
}

setInterval(pollWeather, 300000) // every 5 minutes

wss.on('connection', (ws) => {
  console.log('Client connected')
  if (lastWeather) {
    ws.send(JSON.stringify({ type: 'weather', payload: lastWeather }))
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`)
})
