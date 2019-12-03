// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAN7pTa8JRlh933bSThUo7wLGgh-IlfJGw",
  authDomain: "fir-f9d3b.firebaseapp.com",
  databaseURL: "https://fir-f9d3b.firebaseio.com",
  projectId: "fir-f9d3b",
  storageBucket: "fir-f9d3b.appspot.com",
  messagingSenderId: "147481253692",
  appId: "1:147481253692:web:5c99b0f5ddb5cc87efb039"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// reference to firestore db
var db = firebase.firestore();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

