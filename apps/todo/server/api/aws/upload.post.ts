/**
 * 지연 시간 대기 후 resolve 반환
 */
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default defineEventHandler(async (event) => {
  await delay(100)
  return { hi: 1 }
})
