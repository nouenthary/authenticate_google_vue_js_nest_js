<template>
  <div>
    <GoogleLogin :callback="handleLoginSuccess"/>
  </div>
</template>

<script>
import {GoogleLogin} from 'vue3-google-login';
import axios from 'axios';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    GoogleLogin
  },
  methods: {

    async handleLoginSuccess(response) {
      console.log('Google ID Token:', response.credential);

      try {
        const res = await axios.post('http://localhost:3000/auth/google', {
          token: response.credential,
        });

        console.log('Auth Response:', res.data);
        localStorage.setItem('token', res.data.user.token); // Store JWT
      } catch (error) {
        console.error('Auth Failed:', error.response?.data);
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
