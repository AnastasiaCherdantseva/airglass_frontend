<template>
  <div id="app">
    <h1>Vue + Python + Docker</h1>
    <button @click="fetchData">Get Data from Backend</button>
    <div v-if="data">
      <p>Response: {{ data }}</p>
    </div>
    <div v-if="error" style="color: red">
      Error: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/data')
    data.value = await response.json()
    error.value = null
  } catch (err) {
    error.value = err.message
    data.value = null
  }
}
</script>