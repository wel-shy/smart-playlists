<template lang="pug">
  div#app
    div.container-fluid
      section.hero.is-light.is-medium
        div.hero-body
          div.container
            h1.title Smart Playlists
            h2.subtitle Auto generate smart playlists for Spotify.
    Login(
      v-if="!isLoggedIn"
    )
    Home(
      v-else,
      v-on:logged-out="isLoggedIn = false"
    )
</template>

<script>
import Login from './views/Login.vue';
import Home from './views/Home.vue';

export default {
  name: 'App',
  components: {
    Login,
    Home,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  mounted() {
    if (this.token) {
      this.isLoggedIn = true;
      return;
    }

    const urlString = window.location.href;
    const url = new URL(urlString);
    const authToken = url.searchParams.get('authToken');

    // If url contains an authToken then store a cookie and redirect to root.
    if (authToken) {
      this.setCookie(1, authToken);
      // eslint-disable-next-line prefer-destructuring
      window.location.href = window.location.href.split('?')[0];
    }
  },
  methods: {
    setCookie(expireDays, value) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);
      document.cookie = `${encodeURIComponent('authToken')}=${`${encodeURIComponent(value)}; expires=${expires}`}`;
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop().split(';').shift();
      }
      return null;
    },
  },
  computed: {
    token() {
      return this.getCookie('authToken');
    },
  },
};
</script>

<style lang="scss">
  @import "~bulma";
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
