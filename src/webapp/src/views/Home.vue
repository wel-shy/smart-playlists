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
          ) {{buttonText}}
    section.section
      div.container
        div.columns.is-mobile.subscription(
          v-for="(playlist, index) in playlists"
        )
          div.column.is-8.has-text-left
            h4.is-size-4 {{playlist.name}}
            p {{playlist.description}}
          div.column.is-4.has-text-right
            button(
              v-if="playlist.active",
              @click="toggleActive(index)",
              :class="[{'is-loading': playlist.isLoading}, 'button', 'is-primary', 'is-rounded', 'sub-button']"
            ) Active
            button.button.is-rounded.sub-button(
              v-else,
              @click="toggleActive(index)",
            :class="[{'is-loading': playlist.isLoading}, 'button', 'is-rounded', 'sub-button']"
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
      buttonText: 'Delete Account',
      awaitingConfirm: false,
      playlists: [],
    };
  },
  methods: {
    async toggleActive(index) {
      let response;
      this.playlists[index].isLoading = true;

      if (!this.playlists[index].active) {
        const url = 'http://localhost:8888/api/subs/';
        try {
          response = await axios.post(url, {
            playlistId: this.playlists[index].id,
          },
          {
            headers: { 'x-access-token': this.getToken() },
          });
        } catch (e) {
          console.log(e);
          this.playlists[index].isLoading = false;
        }

        if (response.status !== 200) {
          this.playlists[index].isLoading = false;
          return;
        }
        this.playlists[index].isLoading = false;
        this.playlists[index].active = true;
      } else {
        const url = `http://localhost:8888/api/subs/${this.playlists[index].id}`;

        try {
          response = await axios.delete(url,
            {
              headers: {
                'x-access-token': this.getToken(),
              },
            });
        } catch (e) {
          console.log(e);
          this.playlists[index].isLoading = false;
        }

        if (response.status !== 200) {
          this.playlists[index].isLoading = false;
          return;
        }
        this.playlists[index].isLoading = false;
        this.playlists[index].active = false;
      }
    },
    logout() {
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      this.$emit('logged-out');
    },
    setConfirmDelete() {
      this.awaitingConfirm = true;
      this.buttonText = 'Click to confirm';

      setTimeout(() => {
        this.awaitingConfirm = false;
        this.buttonText = 'Delete Account';
      }, 5000);
    },
    async deleteUser() {
      const url = 'http://localhost:8888/api/user/';

      if (!this.awaitingConfirm) {
        this.setConfirmDelete();
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
  async mounted() {
    let url = 'http://localhost:8888/api/playlists/';
    let response;
    let playlists;

    try {
      response = await axios.get(url);
    } catch (e) {
      console.log(e);
    }

    if (response.status === 200) {
      playlists = response.data.payload;
    }

    url = 'http://localhost:8888/api/subs/';
    try {
      response = await axios.get(url, { headers: { 'x-access-token': this.getToken() } });
    } catch (e) {
      console.log(e);
    }

    if (response.status !== 200) {
      return;
    }

    const subs = response.data.payload;
    const playlistIds = subs.map(sub => sub.playlist);

    playlistIds.forEach((playlistId) => {
      playlists.forEach((playlist, index) => {
        if (playlistId === playlist.id) {
          playlists[index].active = true;
        }
      });
    });

    this.playlists = playlists;
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
