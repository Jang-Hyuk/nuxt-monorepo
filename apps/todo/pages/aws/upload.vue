<script setup lang="ts">
definePageMeta({
  layout: 'aws-layout',
})

async function uploadPhoto() {
  const { data } = await useFetch('/api/aws/upload', {
    method: 'POST',
    body: {
      hi: 'man',
    },
  })
  return data
}

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const previews = ref<FileReader['result'][]>([])

function onChangeFiles() {
  if (!fileInput.value?.files?.length) {
    files.value = []
    previews.value = []
    return false
  }

  files.value = [...fileInput.value.files]

  previews.value = Array(fileInput.value.files.length).fill('');
  [...fileInput.value.files].forEach((file, idx) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.addEventListener('load', (e) => {
      previews.value[idx] = e.target?.result || ''
    })
  })
}
</script>

<template>
  <div>
    업로드
    <button @click="uploadPhoto">
      이미지 업로드
    </button>
    <input ref="fileInput" multiple="multiple" type="file" @change="onChangeFiles"> 파일첨부
    <ul>
      <li v-for="(pV, index) in previews" :key="index">
        <img width="100" height="100" :src="pV">
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
