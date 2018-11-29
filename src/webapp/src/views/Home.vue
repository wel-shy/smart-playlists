<template lang="pug">
  div.home
    section.section.has-text-left(
      v-if="!isLoggedIn"
    )
      div.container
        h3.is-size-3 Let's get started
        a.button.is-primary.is-rounded(
          href="http://localhost:8888/login",
          v-if="!isLoggedIn"
        ) Login with Spotify
    section.section(
      v-else
    )
      div.container.has-text-left
        div
          h3.is-size-3 Manage Your Account
        div
          button.button.is-primary.is-rounded.is-warning(
            @click="logout()"
          ) Logout
          a.button.is-danger.is-rounded.delete-account Delete Account
    section.section(
      v-if="isLoggedIn"
    )
      div.container
        div.columns.is-mobile.subscription(
          v-for="(sub, index) in subscriptions"
        )
          div.column.is-8.has-text-left
            h4.is-size-4 {{sub.name}}
            p {{sub.desc}}
          div.column.is-4.has-text-right
            button.button.is-primary.is-rounded.sub-button(
              v-if="sub.active",
              @click="toggleActive(index)"
            ) Active
            button.button.is-rounded.sub-button(
              v-else,
              @click="toggleActive(index)"
            ) Inactive
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'home',
  props: ['token'],
  components: {},
  data() {
    return {
      isLoggedIn: false,
      authToken: null,
      name: null,
      subscriptions: [
        {
          name: 'Recently Added',
          desc: 'Create a playlist for your most recently added songs.',
          active: true,
        },
        {
          name: 'Top 25',
          desc: 'Your top 25 most played songs.',
          active: false,
        },
      ],
    };
  },
  methods: {
    toggleActive(index) {
      this.subscriptions[index].active = !this.subscriptions[index].active;
    },
    logout() {
      this.isLoggedIn = false;
    },
  },
  mounted() {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const authToken = url.searchParams.get('authToken');
    const userName = url.searchParams.get('user');

    if (authToken) {
      this.isLoggedIn = true;
      this.accessToken = authToken;
    }
    if (userName) {
      this.name = userName;
    }
  },
};
</script>

<style>
  .delete-account {
    margin-left: 5px;
  }
  .subscription {
    border-bottom-color: #CCCCCC;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
  .sub-button {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
