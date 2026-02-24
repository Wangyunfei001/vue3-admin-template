<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="route-fade-slide" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </Transition>
  </RouterView>
</template>
