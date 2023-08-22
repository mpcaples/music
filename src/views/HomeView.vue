<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t('home.listen') }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
    
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="flex-row px-6 pt-6 pb-6 font-bold border-b border-gray-200">
          <label for="selectPlaylist" class="text-gray-600">Choose your playlist:</label>
          <select v-model="selectedPlaylist" id="selectPlaylist" @change="getPlaylistSongs(selectedPlaylist)">
              <option 
                v-for="playlist in playlists"
                :key="playlist.playlistID"
                :value="playlist.playlistID"
                :label="playlist.name"
              ></option>
            </select>
          <span
            class="flex-end"
            v-icon-secondary="{ icon: 'headphones-alt', right: true }"
          >
            <!-- Icon -->
          </span>
        </div>
        <!-- Playlist -->
        <ol id="playlist" v-if="selectedPlaylist !== null">
          <app-song-item v-for="song in playlistSongs" :key="song.docID" :song="song" />
        </ol>
        <ol id="playlist" v-if="selectedPlaylist === null">
          <app-song-item v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase'
import { playlistsGet } from '@/includes/firebaseGet'
import AppSongItem from '@/components/SongItem.vue'
import IconSecondary from '@/directives/icon-secondary'

export default {
  name: 'HomeView',
  components: {
    AppSongItem
  },
  directives: {
    'icon-secondary': IconSecondary
  },
  data() {
    return {
      songs: [],
      playlists: [],
      playlistSongs: [],
      selectedPlaylist: null,
      maxPerPage: 25,
      pendingRequest: false
    }
  },
  async created() {
    this.getSongs()

    window.addEventListener('scroll', this.handleScroll)
  },
  async mounted() {
    await this.displayPlaylists()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        this.getSongs()
      }
    },
    async displayPlaylists() {
        this.playlists = await playlistsGet()
    },
    getPlaylistSongs(selectedPlaylist) {
      const playlist = this.playlists.find((playlist) => playlist.playlistID === selectedPlaylist)
      this.playlistSongs = this.songs.filter((song) => {
        return playlist.songs.includes(song.docID)
      })
    },
    async getSongs() {
      if (this.pendingRequest) {
        return
      }
      this.pendingRequest = true
      let snapshots
      if (this.songs.length) {
        const lastDoc = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get()

        snapshots = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get()
      } else {
        snapshots = await songsCollection.orderBy('modified_name').limit(this.maxPerPage).get()
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data()
        })
      })
      this.pendingRequest = false
    }
  }
}
</script>
