<template lang="pug">
    footer#footer.footer
      div.container
        p Smart Playlists is created by&nbsp;
          |
          a(
            href="https://dwelsh.uk"
          ) Daniel Welsh
          | , and licenced under&nbsp;
          a(
            href="https://opensource.org/licenses/BSD-3-Clause"
          ) BSD-3
          | . Checkout the&nbsp;
          a(
            href="https://github.com/wel-shy/smart-playlists"
          ) source code
          | &nbsp;on Github.
          br
          | If you have any questions about your data or wish for it to be removed, then please
          | send an email to&nbsp;
          a(
            href="mailto:e@dwelsh.uk"
          ) e@dwelsh.uk
</template>

<script>
export default {
  name: 'FooterBar',
};
</script>

<style scoped>
  footer {
    min-height: 25vh;
    /*position: absolute;*/
    /*left: 0;*/
    /*bottom: 0;*/
    /*height: 100px;*/
    /*width: 100%;*/
    /*overflow: hidden;*/
  }
  p {
    padding-top: 5%;
  }
</style>
