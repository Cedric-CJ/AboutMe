<template>
  <div v-if="!isClosed" class="info-message">
    <div>
      <p>
        Diese Seite nutzt keine Cookies, daher ist kein Cookie-Manager erforderlich.
      </p>
      <p>
        <span class="show-more-link" @click="showMore = !showMore">
          {{ showMore ? 'Weniger anzeigen' : 'Mehr anzeigen' }}
        </span>
      </p>
      <div v-if="showMore" class="extended-info">
        <p>
          Gemäß <a href="https://www.gesetze-im-internet.de/ttdsg/__25.html"
                   target="_blank"
                >§ 25 Abs. 2 Nr. 2 TTDSG</a
                >wird auf dieser Website keine Speicherung oder Verarbeitung von Informationen im Endgerät des Nutzers durch Cookies oder ähnliche Technologien vorgenommen. Da die Nutzung von Cookies zur Bereitstellung dieser Webseite nicht erforderlich ist, entfällt die Notwendigkeit eines Cookie-Managers oder einer Einwilligung des Nutzers in die Datenverarbeitung nach <a href="https://gdpr-info.eu/art-12-gdpr/" target="_blank">Art. 12 DSGVO</a>.
        </p>
        <p>
          Art. 12 DSGVO regelt die Verpflichtung zur transparenten Information der Nutzer über die Verarbeitung personenbezogener Daten und die damit verbundenen Rechte. Da auf dieser Website jedoch keine entsprechenden Daten durch Cookies oder ähnliche Technologien verarbeitet werden, entfällt die Pflicht zur Einholung einer Einwilligung.
        </p>
      </div>
      <button @click="closeMessage">Verstanden</button>
    </div>
    <div class="footer-credits">
      <b ref="#" @click.prevent="confirmRedirect">Erstellt von Cedric</b>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoMessage',
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
      if (confirm('Sie verlassen jetzt die Seite und gelangen zur Seite des Erstellers dieser Seite. Möchten Sie fortfahren?')) {
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