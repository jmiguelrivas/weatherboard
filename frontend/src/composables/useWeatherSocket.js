// const curel = {
//   coord: { lon: -117.3677, lat: 47.6166 },
//   weather: [{ id: 804, main: 'Clouds', description: 'overcast clouds', icon: '04n' }],
//   base: 'stations',
//   main: {
//     temp: 61.36,
//     feels_like: 60.71,
//     temp_min: 58.32,
//     temp_max: 63.34,
//     pressure: 1011,
//     humidity: 75,
//     sea_level: 1011,
//     grnd_level: 933,
//   },
//   visibility: 10000,
//   wind: { speed: 3.44, deg: 80 },
//   clouds: { all: 100 },
//   dt: 1753161159,
//   sys: { type: 1, id: 5812, country: 'US', sunrise: 1753100033, sunset: 1753155453 },
//   timezone: -25200,
//   id: 5811704,
//   name: 'Spokane',
//   cod: 200,
// }

import { ref, onBeforeUnmount } from 'vue'

const weatherDic = {
  cloudy: {
    path: '/img/cloudy.png',
    alt: 'office with a cloudy weather',
  },
}

export function useWeatherSocket() {
  const weather = ref(null)
  const temp = ref(null)
  let socket

  const connect = () => {
    socket = new WebSocket('ws://localhost:3000')

    // const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    // socket = new WebSocket(`${protocol}://localhost:3000`)

    // socket = new WebSocket('ws://localhost:3000')

    console.log(0)

    socket.onopen = () => {
      console.log('WebSocket connected')
    }

    socket.onerror = (err) => {
      console.error('WebSocket error:', err)
    }

    socket.onmessage = (event) => {
      console.log('[WebSocket] Received:', event.data)

      const data = JSON.parse(event.data)
      console.log(data)

      if (data.type === 'weather') {
        const condition = data.payload.weather?.[0]?.main?.toLowerCase() || 'unknown'
        weather.value = weatherDic[condition] || { path: '', alt: '' }

        temp.value = 72 //data.payload.main.temp
      }
    }

    socket.onclose = () => {
      console.warn('WebSocket closed, reconnecting...')
      setTimeout(connect, 5000)
    }
  }

  connect()

  onBeforeUnmount(() => {
    socket?.close()
  })

  return { weather, temp }
}
