<!-- <template>
  <div class="flex w-full h-[100svh] lg:h-dvh overflow-hidden">
    <div class="hidden lg:block w-[60%] h-full min-h-0">
      <img
        src="/personLogin3.jpg"
        alt="IM Ingeniería"
        class="w-full h-full object-cover"
      />
    </div>

    <div
      class="relative flex w-full lg:w-[40%] h-full items-center justify-center
             bg-[url('/personLogin3.jpg')] bg-cover bg-center bg-no-repeat lg:bg-none
             overflow-auto lg:overflow-hidden"
    >
      <div class="w-full py-8">
        <slot />
      </div>
    </div>
  </div>
</template> -->


<template>
  <div>
    <slot/>
  </div>
</template>
<script lang="ts" setup></script>
