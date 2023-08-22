import { defineStore } from 'pinia'
import { playlistsCollection } from '@/includes/firebase'

export default defineStore('playlists', {
  state: () => ({
    playlist: []
  }),
  actions: {
    async getPlaylist() {
      const playlistsSnapshot = await playlistsCollection.get()

      playlistsSnapshot.forEach((doc) => {
        this.playlists.push({ ...doc.data(), playlistID: doc.id })
      })
    },
    addPlaylist() {}, 
  }
})
