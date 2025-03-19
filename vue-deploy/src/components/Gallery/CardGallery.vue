<template>
  <div class="CardGallery">
    <div class="card" v-for="card in localizedCards" :key="card.caption">
      <div class="card__image">
        <img :src="card.image" :alt="card.caption" />
      </div>
      <div class="card__head">{{ card.caption }}</div>
    </div>
  </div>
</template>

<script>
import alanya from '@/assets/Pictures/Gallery/5er/Alanya1.jpg'
import berge from '@/assets/Pictures/Gallery/5er/Berge.jpg'
import himmel from '@/assets/Pictures/Gallery/5er/Himmel.jpg'
import himmel2 from '@/assets/Pictures/Gallery/5er/Himmel2.jpg'
import wasserfall from '@/assets/Pictures/Gallery/5er/Wasserfall.jpg'

export default {
  name: 'AccordionGallery',
  data() {
    return {
      cards: [
        { captionDE: 'Alanya', captionEN: 'Alanya', image: alanya },
        { captionDE: 'Berge', captionEN: 'Mountains', image: berge },
        { captionDE: 'Himmel', captionEN: 'Sky', image: himmel },
        { captionDE: 'Wolkiger Himmel', captionEN: 'Cloudy Sky', image: himmel2 },
        { captionDE: 'Wasserfall', captionEN: 'Waterfall', image: wasserfall }
      ]
    }
  },
  computed: {
    language() {
      return window.location.hash.includes('/eng/') ? 'en' : 'de'
    },
    localizedCards() {
      return this.cards.map(card => ({
        ...card,
        caption: this.language === 'en' ? card.captionEN : card.captionDE
      }))
    }
  }
}
</script>
<style>
.CardGallery {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10vmin;
  overflow: hidden;
  transform: skew(5deg);
}
.CardGallery .card {
  flex: 1;
  transition: all 1s ease-in-out;
  height: 75vmin;
  position: relative;
}
.CardGallery .card .card__head {
  color: black;
  background: rgba(255, 30, 173, 0.75);
  padding: 0.5em;
  transform: rotate(-90deg);
  transform-origin: 0% 0%;
  transition: all 0.5s ease-in-out;
  min-width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 1em;
  white-space: nowrap;
}
.CardGallery .card:hover {
  flex-grow: 10;
}
.CardGallery .card:hover .card__image {
  filter: grayscale(0);
}
.CardGallery .card:hover .card__head {
  text-align: center;
  top: calc(100% - 2em);
  color: white;
  background: rgba(0, 0, 0, 0.5);
  font-size: 2em;
  transform: rotate(0deg) skew(-5deg);
}
.CardGallery .card .card__image {
  width: 100%;
  height: 100%;
  transition: all 1s ease-in-out;
  filter: grayscale(100%);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ccc;
}
.CardGallery .card:not(:nth-child(5)) {
  margin-right: 1em;
}
.CardGallery .card .card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>