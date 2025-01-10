// pages/Profile.js
Vue.component('profile', {
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="bg-[#1B2B3A] rounded-lg shadow-xl p-6">
        <!-- Profile Header -->
        <div class="flex items-start justify-between mb-6">
          <h1 class="text-2xl font-bold text-white">My Profile</h1>
          <button 
            v-if="!isEditing"
            @click="startEditing"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            <i class="fas fa-edit mr-2"></i>Edit Profile
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        </div>

        <!-- Profile Content -->
        <div v-else>
          <!-- Profile Image Section -->
          <div class="flex items-center mb-8">
            <div class="relative">
              <img 
                :src="profileData.photoURL || defaultAvatar"
                :alt="profileData.displayName || 'User'"
                class="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
              >
              <div 
                v-if="isEditing"
                class="absolute bottom-0 right-0"
              >
                <label 
                  class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition duration-200"
                >
                  <i class="fas fa-camera"></i>
                  <input 
                    type="file" 
                    @change="handleImageUpload"
                    accept="image/*"
                    class="hidden"
                  >
                </label>
              </div>
            </div>
            
            <div class="ml-6">
              <div v-if="!isEditing">
                <h2 class="text-xl font-bold text-white">
                  {{ profileData.displayName || 'Anonymous User' }}
                </h2>
                <p class="text-gray-400">{{ profileData.email }}</p>
              </div>
              <div v-else class="space-y-2">
                <input 
                  v-model="editedProfile.displayName"
                  type="text"
                  class="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none w-full"
                  placeholder="Display Name"
                >
              </div>
            </div>
          </div>

          <!-- Profile Details -->
          <div class="space-y-6">
            <!-- Bio Section -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Bio</h3>
              <div v-if="!isEditing" class="text-gray-300">
                {{ profileData.bio || 'No bio added yet.' }}
              </div>
              <textarea
                v-else
                v-model="editedProfile.bio"
                rows="4"
                class="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <!-- Contact Information -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Contact Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-400 text-sm mb-1">Location</label>
                  <div v-if="!isEditing" class="text-gray-300">
                    {{ profileData.location || 'Not specified' }}
                  </div>
                  <input
                    v-else
                    v-model="editedProfile.location"
                    type="text"
                    class="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    placeholder="Your location"
                  >
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-1">Website</label>
                  <div v-if="!isEditing" class="text-gray-300">
                    <a 
                      v-if="profileData.website"
                      :href="profileData.website"
                      target="_blank"
                      class="text-blue-500 hover:text-blue-400"
                    >{{ profileData.website }}</a>
                    <span v-else>Not specified</span>
                  </div>
                  <input
                    v-else
                    v-model="editedProfile.website"
                    type="url"
                    class="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    placeholder="Your website URL"
                  >
                </div>
              </div>
            </div>

            <!-- Account Settings -->
            <div v-if="isEditing">
              <h3 class="text-lg font-semibold text-white mb-2">Account Settings</h3>
              <div class="space-y-4">
                <div>
                  <label class="flex items-center space-x-2 text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      v-model="editedProfile.emailNotifications"
                      class="form-checkbox text-blue-600 rounded"
                    >
                    <span>Receive email notifications</span>
                  </label>
                </div>
                <div>
                  <label class="flex items-center space-x-2 text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      v-model="editedProfile.profileVisibility"
                      class="form-checkbox text-blue-600 rounded"
                    >
                    <span>Make profile public</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="isEditing" class="flex space-x-4 pt-6">
              <button 
                @click="saveProfile"
                :disabled="isSaving"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="isSaving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button 
                @click="cancelEditing"
                :disabled="isSaving"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      loading: true,
      isEditing: false,
      isSaving: false,
      defaultAvatar: 'https://via.placeholder.com/150',
      profileData: {
        displayName: '',
        email: '',
        photoURL: '',
        bio: '',
        location: '',
        website: '',
        emailNotifications: false,
        profileVisibility: false
      },
      editedProfile: {
        displayName: '',
        bio: '',
        location: '',
        website: '',
        emailNotifications: false,
        profileVisibility: false
      }
    };
  },
  methods: {
    async loadProfile() {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          this.$router.push('/');
          return;
        }

        const doc = await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        if (doc.exists) {
          this.profileData = {
            ...this.profileData,
            ...doc.data(),
            email: user.email,
            displayName: user.displayName || doc.data().displayName,
            photoURL: user.photoURL || doc.data().photoURL
          };
        } else {
          this.profileData = {
            ...this.profileData,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        this.loading = false;
      }
    },
    startEditing() {
      this.editedProfile = { ...this.profileData };
      this.isEditing = true;
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        this.isSaving = true;
        const user = firebase.auth().currentUser;
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`profile-images/${user.uid}/${file.name}`);
        
        await fileRef.put(file);
        const photoURL = await fileRef.getDownloadURL();
        
        await user.updateProfile({ photoURL });
        this.editedProfile.photoURL = photoURL;
        this.profileData.photoURL = photoURL;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        this.isSaving = false;
      }
    },
    async saveProfile() {
      if (!firebase.auth().currentUser) return;

      try {
        this.isSaving = true;
        
        // Update Firebase Auth profile
        await firebase.auth().currentUser.updateProfile({
          displayName: this.editedProfile.displayName
        });

        // Update Firestore document
        await firebase.firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({
            displayName: this.editedProfile.displayName,
            bio: this.editedProfile.bio,
            location: this.editedProfile.location,
            website: this.editedProfile.website,
            emailNotifications: this.editedProfile.emailNotifications,
            profileVisibility: this.editedProfile.profileVisibility,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

        this.profileData = { ...this.editedProfile };
        this.isEditing = false;
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile changes. Please try again.');
      } finally {
        this.isSaving = false;
      }
    },
    cancelEditing() {
      this.editedProfile = { ...this.profileData };
      this.isEditing = false;
    }
  },
  created() {
    this.loadProfile();
  }
});

const Profile = {
  template: '<profile></profile>'
};