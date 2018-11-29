<template lang="pug">
  div#app
    div.container-fluid
      section.hero.is-light.is-medium
        div.hero-body
          div.container
            h1.title Smart Playlists
            h2.subtitle Auto generate smart playlists for Spotify.
    RouterView
</template>

<style lang="scss">
  @import "~bulma";
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
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
