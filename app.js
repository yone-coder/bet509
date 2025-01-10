

firebase.auth().onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
});

const routes = [
  { path: '/', component: Home },
  { path: '/explore', component: Explore },
  { path: '/live', component: Live },
  { path: '/wallet', component: Wallet },
  { path: '/profile', component: Profile }
];


const router = new VueRouter({
  routes
});

// Add navigation guards
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next('/');
  } else {
    next();
  }
});

new Vue({
  el: '#app',
  router,
  data: {
    currentUser: null,
    isLoading: true
  },
  created() {
    // Check if Firebase is properly initialized
    if (!firebase.apps.length) {
      console.error('Firebase not initialized');
    }

    // Set up authentication state observer
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user;
      this.isLoading = false;
      console.log('Auth state changed in Vue instance:', user ? 'User logged in' : 'User logged out');
    });
  },
  methods: {
    async signOut() {
      try {
        await firebase.auth().signOut();
        this.$router.push('/');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  }
}); 