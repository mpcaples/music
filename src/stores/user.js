import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'
export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    // use regular functions not arrow functions
    async register(values) {
      const userCreds = await auth.createUserWithEmailAndPassword(values.email, values.password)

      await usersCollection.doc(userCreds.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
        user_type: values.user_type
      })

      await userCreds.user.updateProfile({
        displayName: values.name
      })

      this.userLoggedIn = true
    },
    async authenticate(values) {
      await auth.signInWithEmailAndPassword(values.email, values.password)

      this.userLoggedIn = true
    }
  }
})
