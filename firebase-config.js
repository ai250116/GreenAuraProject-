// 1. Your Real Firebase Cloud Credentials Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCefStpKmUpwO7ooSxKON0ZEZOIcGiqv4",
    authDomain: "greenaura-project.firebaseapp.com",
    projectId: "greenaura-project",
    storageBucket: "greenaura-project.firebasestorage.app",
    messagingSenderId: "428297372734",
    appId: "1:428297372734:web:7c105cc01515dc55c7fd6f"
};

// 2. Safe App Initialization Node
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 3. Instantiate Firestore Reference
const db = firebase.firestore();

// 4. Form Event Submission Pipeline Listener
document.getElementById('riderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log("🔄 Contacting Google Firebase Firestore cluster...");

    const name = document.getElementById('sender_name').value;
    const address = document.getElementById('pickup_address').value;
    const type = document.getElementById('item_type').value;
    const weight = parseInt(document.getElementById('item_weight').value);

    // Write operation executing cleanly into your database
    db.collection("rider_requests").add({
        sender_name: name,
        pickup_address: address,
        item_type: type,
        item_weight: weight,
        created_at: new Date()
    })
    .then((docRef) => {
        console.log("✅ Success! Firestore document generated with ID:", docRef.id);
        alert("🍃 Success! Saved to Cloud Firebase Firestore!");
        document.getElementById('riderForm').reset();
    })
    .catch((error) => {
        console.error("❌ Firebase Write Failure:", error);
        alert("Database connection failure. Please review console.");
    });
});