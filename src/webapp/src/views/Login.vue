<template lang="pug">
div.login
  section.section.has-text-left
    div.container
      h3.is-size-3 Let's get started
      a.button.is-primary.is-rounded.is-large(
        href="http://localhost:8888/login"
      ) Login with Spotify
  section.section
    div.container
      p.info
      |
      em.info Login in with Spotify will create a Smart Playlists account. We store your email
        | so we can contact you about functional changes to your account, as well as a Spotify
        | token that allows us to update your account. The permissions this token gives are listed
        | on the Spotify authentication page. We also use a cookie to store an access token for
        | our services every time you login which your browser will delete after 1 day.
      |
      br
      |
      br
      |
      strong.strong &nbsp;If you click login you agree to these conditions.
</template>

<script>
export default {
  name: 'Login',
};
</script>

<style scoped>
.info {
  color: #888888;
}

.button {
  margin-top: 5%;
}
</style>
