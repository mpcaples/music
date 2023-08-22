<template>
  <div>
    <h1>{{ playlist.name }}</h1>
    <ul>
      <app-song-item v-for="song in playlistSongs" :key="song.docID" :song="song" />
    </ul>
  </div>
</template>

<script>
import { playlistsCollection, songsCollection } from '@/includes/firebase'
import AppSongItem from '@/components/SongItem.vue'

export default {
  name: 'PlaylistItem',
  components: { AppSongItem },
  data() {
    return {
      playlist: {},
      playlistSongs: []
    }
  },
  methods: {
    async getPlaylist() {
      const playlistsSnapshot = await playlistsCollection.doc(this.$route.params.id).get()

      this.playlist = { ...playlistsSnapshot.data() }
    },
    async getSongs(id) {
      const songSnapshot = await songsCollection.where('docID', '==', id).get()

      songSnapshot.forEach((snap) => {
        this.playlistSongs.push({ ...snap.data() })
      })
    }
  },
  created() {
    this.getPlaylist()
  },
  watch: {
    async playlist(newValue) {
      const playlist = await newValue
      console.log('This is the playlist:', playlist)
      playlist.songs.forEach(async (song) => {
        const songSnapshot = await songsCollection.where('docID', '==', song).get()
        let snappy
        songSnapshot.forEach((snap) => {
          snappy = { ...snap.data() }
        })
        this.playlistSongs.push(snappy)
      })
      console.log('This is the playlist songs:', this.playlistSongs)
    }
  }
}
</script>
