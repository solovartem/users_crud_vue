<template>
  <div>
    <b-alert class="mt-5" show dismissible :variant="variant">
        {{msg}}
    </b-alert>
  </div>
</template>

<script>
  export default {
    name: 'Alert',
    props: {
        msg: String,
        variant: String
    }
  }
</script>
