<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AvatarCropPayload } from '@/types/user'
import { buildAvatarFilename } from '@/views/user-center/avatar-utils'

const props = defineProps<{
  file: globalThis.File | null
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: [payload: AvatarCropPayload, previewUrl: string]
  error: [message: string]
}>()

const { t } = useI18n()
const imageUrl = ref('')
const imageEl = ref<globalThis.HTMLImageElement | null>(null)
const stageEl = ref<globalThis.HTMLDivElement | null>(null)
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const dragging = ref(false)
const dragStart = ref({ x: 0, y: 0, ox: 0, oy: 0 })

const MIN_SCALE = 1
const MAX_SCALE = 3
const OUTPUT_SIZE = 320

const imageStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
}))

function reset() {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

function revokeImageUrl() {
  if (imageUrl.value) {
    globalThis.URL.revokeObjectURL(imageUrl.value)
    imageUrl.value = ''
  }
}

watch(
  () => props.file,
  async (file) => {
    revokeImageUrl()
    reset()
    if (!file) return
    imageUrl.value = globalThis.URL.createObjectURL(file)
    await nextTick()
    fitImageToStage()
  },
)

watch(
  () => props.visible,
  (visible) => {
    if (!visible) reset()
  },
)

function fitImageToStage() {
  const image = imageEl.value
  if (!image) return
  const baseScale = Math.max(OUTPUT_SIZE / image.naturalWidth, OUTPUT_SIZE / image.naturalHeight)
  scale.value = Math.min(Math.max(baseScale, MIN_SCALE), MAX_SCALE)
  offsetX.value = 0
  offsetY.value = 0
}

function onDragStart(event: globalThis.PointerEvent) {
  dragging.value = true
  dragStart.value = {
    x: event.clientX,
    y: event.clientY,
    ox: offsetX.value,
    oy: offsetY.value,
  }
  stageEl.value?.setPointerCapture(event.pointerId)
}

function onDragMove(event: globalThis.PointerEvent) {
  if (!dragging.value) return
  offsetX.value = dragStart.value.ox + (event.clientX - dragStart.value.x)
  offsetY.value = dragStart.value.oy + (event.clientY - dragStart.value.y)
}

function onDragEnd(event: globalThis.PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  stageEl.value?.releasePointerCapture(event.pointerId)
}

async function exportCrop() {
  const image = imageEl.value
  if (!image) {
    emit('error', t('userCenter.avatar.errors.cropFailed'))
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    emit('error', t('userCenter.avatar.errors.cropFailed'))
    return
  }

  const scaledWidth = image.naturalWidth * scale.value
  const scaledHeight = image.naturalHeight * scale.value
  const drawX = (OUTPUT_SIZE - scaledWidth) / 2 + offsetX.value
  const drawY = (OUTPUT_SIZE - scaledHeight) / 2 + offsetY.value
  ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
  ctx.drawImage(image, drawX, drawY, scaledWidth, scaledHeight)

  const blob = await new Promise<globalThis.Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/png')
  })
  if (!blob) {
    emit('error', t('userCenter.avatar.errors.cropFailed'))
    return
  }

  const previewUrl = globalThis.URL.createObjectURL(blob)
  emit(
    'confirm',
    {
      blob,
      filename: buildAvatarFilename(),
      width: OUTPUT_SIZE,
      height: OUTPUT_SIZE,
    },
    previewUrl,
  )
}

onBeforeUnmount(() => {
  revokeImageUrl()
})
</script>

<template>
  <div v-if="visible && file" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
    <div class="glass w-full max-w-xl rounded-2xl p-4">
      <h3 class="text-base font-semibold">{{ t('userCenter.avatar.cropTitle') }}</h3>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">{{ t('userCenter.avatar.cropDesc') }}</p>

      <div class="mt-4 flex flex-col gap-4 sm:flex-row">
        <div
          ref="stageEl"
          class="relative h-60 w-60 overflow-hidden rounded-xl border border-slate-300 bg-slate-100 dark:border-slate-500 dark:bg-slate-800"
          data-testid="avatar-crop-stage"
          @pointerdown="onDragStart"
          @pointermove="onDragMove"
          @pointerup="onDragEnd"
          @pointercancel="onDragEnd"
        >
          <img
            ref="imageEl"
            :src="imageUrl"
            class="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
            :style="imageStyle"
            alt="crop-source"
            draggable="false"
            @load="fitImageToStage"
          />
        </div>

        <div class="flex-1 space-y-3">
          <label class="block space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-300">{{ t('userCenter.avatar.zoom') }}</span>
            <input v-model="scale" type="range" min="1" max="3" step="0.01" class="w-full" />
          </label>
          <p class="text-xs text-slate-500 dark:text-slate-300">{{ t('userCenter.avatar.dragHint') }}</p>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button class="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-slate-600" type="button" @click="emit('close')">
          {{ t('common.cancel') }}
        </button>
        <button class="btn" type="button" data-testid="avatar-crop-confirm" @click="exportCrop">
          {{ t('userCenter.avatar.applyCrop') }}
        </button>
      </div>
    </div>
  </div>
</template>
