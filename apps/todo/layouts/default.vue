<template>
  <div>
    Some default layout shared across all pages
    <header>
      <NuxtLink to="/">
        main
      </NuxtLink>
      <NuxtLink to="/option">
        Option API
      </NuxtLink>
      <NuxtLink to="/composition">
        Composition API
      </NuxtLink>
    </header>
    <slot />
  </div>
</template>
