<template>
  <div class="container mx-auto mt-6">
    <h1 class="w-full mb-8 text-center text-slate-600 font-bold uppercase text-2xl mr-4 relative">
      My Playlists
    </h1>
    <ul v-for="playlist in playlists" :key="playlist.id">
      <li
        class="p-6 bg-gray-50 border border-gray-200 text-slate-600"
        :name="playlist.name"
        :songs="playlist.songs"
      >
      <div class="flex justify-between">
        <router-link :to="{ name: 'playlist', params: { id: playlist.playlistID } }">
          {{ playlist.name }}
        </router-link>
        <button @click.prevent="onDeletePlaylist(playlist.playlistID)">Delete Playlist</button>
      </div>
      </li>
    </ul>
    <button
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      @click.prevent="onShowForm"
    >
      Add Playlist
    </button>
    <vee-form @submit="addPlaylist" v-if="showForm === true">
      <div class="mb-3">
        <label class="inline-block mb-2">Playlist name</label>
        <vee-field
          name="name"
          type="name"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Playlist name"
        />
        <ErrorMessage class="text-red-600" name="name" />
        <label class="inline-block mb-2">Songs to include</label>
        <vee-field
          as="select"
          name="songs"
          multiple
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Choose song"
          v-model="test"
        >
          <option v-for="song in songs" :key="song.docID" :value="song.docID">
            {{ song.modified_name }}
          </option>
        </vee-field>
        <ErrorMessage class="text-red-600" name="songs" />
      </div>
      <button
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
        :disabled="login_in_submission"
      >
        Submit
      </button>
    </vee-form>
  </div>
</template>

<script>
import { playlistsCollection, songsCollection } from '@/includes/firebase'

export default {
  name: 'PlaylistsView',
  data() {
    return {
      playlists: [],
      songs: [],
      showForm: false,
      test: []
    }
  },
  methods: {
    async getPlaylists() {
      const playlistsSnapshot = await playlistsCollection.get()

      playlistsSnapshot.forEach((doc) => {
        this.playlists.push({ ...doc.data(), playlistID: doc.id })
      })
    },
    async getSongs() {
      const songsSnapshot = await songsCollection.get()

      songsSnapshot.forEach((doc) => {
        this.songs.push({ ...doc.data(), docID: doc.id })
      })
    },
    onShowForm() {
      this.showForm = !this.showForm
    },
    async addPlaylist(values) {
      const playlist = {
        name: values.name,
        songs: values.songs
      }

      await playlistsCollection.add(playlist)
      this.playlists = []
      this.getPlaylists()
      this.showForm = false
    }, 
    async onDeletePlaylist(playlistID) {
      const playlistIndex = this.playlists.findIndex((playlist) => playlist.playlistID === playlistID)
      this.playlists.splice(playlistIndex, 1)
    
      await playlistsCollection.doc(playlistID).delete()
      
    }
  },
  created() {
    this.getPlaylists()
    this.getSongs()
  }
}
</script>
