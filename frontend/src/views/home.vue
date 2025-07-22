<template>
  <section class="overflow-hidden relative">
    <img :src="weather?.path" :alt="weather?.alt" class="w-full h-full object-cover absolute" />
    <div class="board relative pointer-events-none h-full">
      <p class="temperature absolute bottom-4 left-4 text-4xl">{{ temp }}&deg;</p>
      <p class="time absolute top-4 right-4 text-4xl">
        <time :datetime="time">{{ time }}</time>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useWeatherSocket } from '@/composables/useWeatherSocket'

const { weather, temp } = useWeatherSocket()

const time = ref('')
onMounted(() => {
  const update = () => {
    time.value = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  update()
  const interval = setInterval(update, 1000)

  onUnmounted(() => clearInterval(interval))
})
</script>
