Inspiration: https://codepen.io/seanfree/pen/BLrNzx
<template>
  <div id="SlideGallery">
    <div
        v-for="(item, index) in info"
        :key="index"
        class="slide"
        :class="slideStates[index]"
        @click="onSlideClick(index)"
    >
      <div class="image">
        <span>Hier Bsp. Bild</span>
      </div>
      <div class="overlay"></div>
      <div class="content">
        <h2 class="title" :data-title="item.city">{{ item.city }}</h2>
        <div class="emblem">
          <span>Hier Bsp. Bild</span>
        </div>
        <ul class="city-info">
          <li class="country">Country: {{ item.country }}</li>
          <li class="founded">Founded: {{ item.founded }}</li>
          <li class="population">Population: {{ item.population }}</li>
        </ul>
      </div>
      <!-- Close-Button (stoppt das Click-Event) -->
      <div class="btn-close" @click.stop="onClose(index)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const info = [
  {
    city: 'Venice',
    country: 'Italy',
    population: '260,060',
    founded: '697',
    image: 'Hier Bsp. Bild',
    emblem: 'Hier Bsp. Bild'
  },
  {
    city: 'Paris',
    country: 'France',
    population: '2.2 Million',
    founded: '~250BC',
    image: 'Hier Bsp. Bild',
    emblem: 'Hier Bsp. Bild'
  },
  {
    city: 'Salzburg',
    country: 'Austria',
    population: '145,871',
    founded: '1622',
    image: 'Hier Bsp. Bild',
    emblem: 'Hier Bsp. Bild'
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
    population: '1.2 Million',
    founded: '870',
    image: 'Hier Bsp. Bild',
    emblem: 'Hier Bsp. Bild'
  }
];

const slideStates = ref(info.map(() => 'anim-in'));

function onSlideClick(index) {
  if (slideStates.value[index] !== 'active' && !slideStates.value.some(s => s === 'active')) {
    slideStates.value[index] = 'active';
    slideStates.value = slideStates.value.map((state, i) =>
        i !== index ? 'anim-out' : state
    );
  }
}

function onClose(index) {
  slideStates.value[index] = 'last-viewed';
  slideStates.value = slideStates.value.map((state, i) =>
      i !== index ? 'anim-in' : state
  );
}
</script>

<style scoped>
#SlideGallery {
  justify-content: center;
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.slide {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: all 1s;
}

/* .last-viewed */
.slide.last-viewed .btn-close:after {
  transition-delay: 0s;
}
.slide.last-viewed .btn-close:before {
  transition-delay: 0.1s;
}
.slide.last-viewed .content .city-info {
  transition-delay: 0s;
}
.slide.last-viewed .content .city-info li:nth-of-type(1) {
  transition-delay: 0.2s;
}
.slide.last-viewed .content .city-info li:nth-of-type(2) {
  transition-delay: 0.4s;
}
.slide.last-viewed .content .city-info li:nth-of-type(3) {
  transition-delay: 0.6s;
}
.slide.last-viewed .content .emblem {
  transition: all 0.5s;
  transition-delay: 0s;
}

/* .last-viewed und .active */
.slide.last-viewed .image,
.slide.active .image {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

/* .active */
.slide.active {
  cursor: default;
}

.slide.active .overlay {
  width: 25%;
  background-size: 100% 100%;
  transition: all 1.25s;
  transition-delay: 1.75s;
}

.slide.active .content {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.slide.active .content .title {
  width: 25%;
  opacity: 1;
  transform: translateY(30px);
  transition: all 1s;
  transition-delay: 1.25s;
}

.slide.active .content .title:after {
  height: 100%;
  color: white;
  overflow: initial;
}

.slide.active .content .title:before {
  transform: scaleX(1);
  transition-delay: 2s;
}

.slide.active .content .city-info li {
  opacity: 1;
  transform: translateX(0);
}

.slide.active .content .emblem {
  opacity: 0.8;
  transform: translateY(100px);
}

.slide.active .btn-close {
  cursor: pointer;
  pointer-events: auto;
}

.slide.active .btn-close:before,
.slide.active .btn-close:after {
  opacity: 1;
}

.slide.active .btn-close:after {
  transform: rotate(45deg) translateX(0);
}

.slide.active .btn-close:before {
  transform: rotate(-45deg) translateX(0);
}

/* .anim-in */
.slide.anim-in {
  transition-delay: 0.5s;
}

.slide.anim-in .image {
  top: -20%;
  left: -140%;
  height: 140%;
  width: 140%;
  animation: img-anim-in 1.2s forwards;
}

/* .anim-out */
.slide.anim-out {
  flex: 0;
  cursor: default;
  transition-delay: 0.5s;
}

.slide.anim-out .image {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  animation: img-anim-out 1.2s forwards;
}

/* explizite Animation-Delays für jedes Slide (nth-of-type 1 bis 4) */
.slide:nth-of-type(1).anim-in .image {
  animation-delay: 0.2s;
}
.slide:nth-of-type(2).anim-in .image {
  animation-delay: 0.4s;
}
.slide:nth-of-type(3).anim-in .image {
  animation-delay: 0.6s;
}
.slide:nth-of-type(4).anim-in .image {
  animation-delay: 0.8s;
}
.slide:nth-of-type(1).anim-out .image {
  animation-delay: 0.2s;
}
.slide:nth-of-type(2).anim-out .image {
  animation-delay: 0.4s;
}
.slide:nth-of-type(3).anim-out .image {
  animation-delay: 0.6s;
}
.slide:nth-of-type(4).anim-out .image {
  animation-delay: 0.8s;
}

.image {
  position: absolute;
  background: #ccc;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-size: cover;
  background-position: center;
  pointer-events: none;
  transition: all 1s;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(rgba(20,20,20,0.7), rgba(20,20,20,0));
  background-position: 0 0;
  background-size: 100% 200%;
  opacity: 1;
  pointer-events: none;
  transition: all 0.5s;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.content .title {
  position: absolute;
  top: -10px;
  height: 65px;
  width: 100%;
  box-sizing: border-box;
  font-size: 3em;
  text-align: center;
  text-shadow: 0 2px 2px #2f2f2f;
  color: #3f3f3f;
  opacity: 0;
  pointer-events: none;
  transition: all 0.5s;
}

.content .title:after {
  position: absolute;
  top: 0;
  height: 0;
  width: 100%;
  display: block;
  content: attr(data-title);
  overflow: hidden;
  color: #fff59d;
  transition: all 0.85s;
}

.content .title:before {
  position: absolute;
  bottom: 15px;
  display: block;
  content: "";
  height: 2px;
  width: 85%;
  background: white;
  box-shadow: 0 2px 6px #2f2f2f;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 1.25s;
}

.content .emblem {
  position: absolute;
  height: 200px;
  width: 25%;
  background: #ddd;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(120px);
  transition: all 1s;
  transition-delay: 1.75s;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.content .city-info {
  position: absolute;
  bottom: 30px;
  right: 30px;
  padding: 30px 30px 30px 120px;
  font-size: 1.25em;
  color: white;
  text-shadow: 0 1px 4px #0f0f0f;
  background-image: linear-gradient(90deg, rgba(20,20,20,0), rgba(20,20,20,0.7));
  opacity: 0;
  transition: all 1s;
  transition-delay: 2s;
}

.content .city-info li {
  position: relative;
  margin-bottom: 5px;
  text-align: justify;
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.75s;
}

.btn-close {
  position: absolute;
  z-index: 100;
  top: 20px;
  right: 20px;
  height: 24px;
  width: 24px;
  pointer-events: none;
}

.btn-close:before,
.btn-close:after {
  position: absolute;
  top: 12px;
  display: block;
  content: "";
  width: 100%;
  height: 4px;
  background-color: white;
  opacity: 0;
  cursor: pointer;
  transition: all 0.5s;
}

.btn-close:after {
  transform: rotate(45deg) translateX(-12px);
  transition-delay: 3s;
}

.btn-close:before {
  transform: rotate(-45deg) translateX(12px);
  transition-delay: 3.2s;
}

.slide:hover:not(.active):not(.anim-out) .image {
  transform: scale(1.1);
}

.slide:hover:not(.active):not(.anim-out) .overlay {
  opacity: 0.6;
}

.slide:hover:not(.active):not(.anim-out) .content .title {
  opacity: 1;
  transform: translateY(30px);
}

.slide:hover:not(.active):not(.anim-out) .content .title:after {
  height: 100%;
}

#codepen-link {
  position: absolute;
  right: 15px;
  bottom: 15px;
  height: 40px;
  width: 40px;
  z-index: 10;
  border-radius: 50%;
  background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/544318/logo.jpg");
  background-position: center;
  background-size: cover;
  opacity: 0.7;
  transition: all 0.25s;
}

#codepen-link:hover {
  opacity: 1;
  box-shadow: 0 2px 6px #0f0f0f;
}

@keyframes img-anim-in {
  to {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}

@keyframes img-anim-out {
  to {
    left: -100%;
  }
}
</style>