import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.app = app.database();
    this.storage = app.storage();
  }

  login(email, password) {
    return app.auth().signInWithEmailAndPassword(email, password)
  }

  async register(name, email, password) {
    await app.auth().createUserWithEmailAndPassword(email, password)

    const uid = app.auth().currentUser.uid;

    return app.database().ref('usuarios').child(uid).set({
      nome: name
    })
  }

  logout = async () => {
    await app.auth().signOut()
      .catch((error) => {
        console.log(error)
      });

      localStorage.removeItem("nome");
  }

  isInitialized() {
    return new Promise(resolve => {
      app.auth().onAuthStateChanged(resolve);
    })
  }

  getCurrent() {
    return app.auth().currentUser && app.auth().currentUser.email
  }

  getCurrentUid() {
    return app.auth().currentUser && app.auth().currentUser.uid
  }

  async getUserName(callback) {
    if (!app.auth().currentUser) {
      return null;
    }

    const uid = app.auth().currentUser.uid;
    await app.database().ref('usuarios').child(uid)
      .once('value').then(callback);
  }

  async getGame(id, callback) {
    await app.database().ref('games').child(id)
      .once('value').then(callback).catch(error => {
        return null
    });
  }

  async deleteComment(id, commentId) {
    await app.database().ref('comentarios').child(id).child(commentId).remove();
  }

  async deleteGame(id) {
    await app.database().ref('games').child(id).remove();
  }

  async editGame(id, data) {
    await app.database().ref('games').child(id).set(data);
  }
}

export default new Firebase();