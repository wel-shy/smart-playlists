<template lang="pug">
  div.home
    section.section
      div.container.has-text-left
        div
          h3.is-size-3 Manage Your Account
        div
          button.button.is-primary.is-rounded.is-warning(
            @click="logout"
          ) Logout
          a.button.is-danger.is-rounded.delete-account(
            @click="deleteUser"
          ) Delete Account
    section.section
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
import axios from 'axios';

export default {
  name: 'home',
  props: ['token'],
  components: {},
  data() {
    return {
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
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      this.$emit('logged-out');
    },
    async deleteUser() {
      const url = 'http://localhost:8888/api/user/';

      if (!confirm('Are you sure you wish to delete your Smart Playlists account?')) {
        return;
      }

      try {
        await axios.delete(url, { headers: { 'x-access-token': this.getToken() } });
      } catch (e) {
        console.log(e);
        alert('Account could not be deleted');
      }

      this.logout();
    },
    getToken() {
      const value = `; ${document.cookie}`;
      const parts = value.split('; authToken=');
      if (parts.length === 2) {
        return parts.pop().split(';').shift();
      }
      return null;
    },
  },
  mounted() {
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
