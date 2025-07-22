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
