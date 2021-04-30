<template>
    <b-icon class="btn p-0" :icon="icon" :variant="variant" aria-hidden="true"></b-icon>
</template>

<script>
export default {
    name: 'Icon',
    props : {
        icon : String,
        variant: String
    }
}
</script>