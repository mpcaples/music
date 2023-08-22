import { playlistsCollection } from '@/includes/firebase'

const playlistsGet = async () => {
    const playlistsSnapshot = await playlistsCollection.get()
    const playlists = []

    playlistsSnapshot.forEach((doc) => {
      playlists.push({ ...doc.data(), playlistID: doc.id })
    })
    return playlists
}

export { playlistsGet }