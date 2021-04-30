<template>
    <div>
        <b-button :variant="variant">{{msg}}</b-button>
    </div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    msg: String,
    variant: String
  },
  methods: {
    editUser(userData) {
        console.log("user data : ", userData);
      }
  },
}
</script>