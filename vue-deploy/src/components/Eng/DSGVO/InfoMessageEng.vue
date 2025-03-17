<template>
  <div v-if="!isClosed" class="info-message">
    <div>
      <p>
        This site does not use cookies, therefore no cookie manager is required.
      </p>
      <p>
        <span class="show-more-link" @click="showMore = !showMore">
          {{ showMore ? 'Show less' : 'Show more' }}
        </span>
      </p>
      <div v-if="showMore" class="extended-info">
        <p>
          According to
          <a
              href="https://www.gesetze-im-internet.de/ttdsg/__25.html"
              target="_blank"
          >§ 25 (2) No. 2 TTDSG</a
          >, no storage or processing of information in the user's device is
          carried out by cookies or similar technologies on this website. Since
          the use of cookies is not necessary for providing this website, there
          is no need for a cookie manager or user consent for data processing
          under
          <a href="https://gdpr-info.eu/art-12-gdpr/" target="_blank"
          >Art. 12 GDPR</a
          >.
        </p>
        <p>
          Art. 12 GDPR regulates the obligation to transparently inform users
          about the processing of personal data and the associated rights.
          However, since this website does not process such data by means of
          cookies or similar technologies, there is no requirement to obtain
          user consent.
        </p>
      </div>
      <button @click="closeMessage">Understood</button>
    </div>
    <div class="footer-credits">
      <b ref="#" @click.prevent="confirmRedirect">Created by Cedric</b>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoMessageEng',
  data() {
    return {
      showMore: false,
      isClosed: false,
    };
  },
  created() {
    if (localStorage.getItem('infoMessageClosed') === 'true') {
      this.isClosed = true;
    }
  },
  methods: {
    confirmRedirect() {
      if (
          confirm(
              'You are now leaving the page and will be directed to the creator’s page. Continue?'
          )
      ) {
        window.location.href = 'https://cedric-cj.github.io/AboutMe/';
      }
    },
    closeMessage() {
      localStorage.setItem('infoMessageClosed', 'true');
      this.isClosed = true;
      this.$emit('close-message');
    }
  },
};
</script>
<style scoped>
</style>