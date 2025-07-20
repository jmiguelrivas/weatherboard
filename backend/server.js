import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import fetch from 'node-fetch'

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

let lastWeather = null

const fetchWeather = async () => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=YOUR_API_KEY`)
  const data = await res.json()
  return data
}

setInterval(async () => {
  try {
    const weather = await fetchWeather()
    const changed = JSON.stringify(weather) !== JSON.stringify(lastWeather)
    if (changed) {
      lastWeather = weather
      const payload = JSON.stringify({ type: 'weather', data: weather })
      wss.clients.forEach(client => {
        if (client.readyState === 1) client.send(payload)
      })
    }
  } catch (err) {
    console.error('Failed to fetch weather:', err)
  }
}, 300000) // every 5 min

wss.on('connection', ws => {
  if (lastWeather) {
    ws.send(JSON.stringify({ type: 'weather', data: lastWeather }))
  }
})

server.listen(3000, () => {
  console.log('Server running on port 3000')
})
