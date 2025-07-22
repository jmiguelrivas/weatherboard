<template>
  <section class="overflow-hidden relative">
    <img
      src="/img/cloudy.png"
      alt="office with a cloudy weather"
      class="w-full h-full object-cover absolute"
    />
    <div class="board relative pointer-events-none h-full">
      <p class="temperature absolute bottom-4 left-4 text-4xl">72</p>
      <p class="time absolute top-4 right-4 text-4xl">
        <time datetime="16:00">16:00</time>
      </p>
    </div>
  </section>
</template>

<style scoped></style>
