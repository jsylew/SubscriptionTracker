var usernamesRef = db.collection('user_names');

usernamesRef.doc('user 1').set({
    email: "user1@gmail.com",
    name: "Jay"
})

usernamesRef.doc('user 2').set({
    email: "user2@gmail.com",
    name: "Jason"
})

usernamesRef.doc('user 3').set({
    email: "user3@gmail.com",
    name: "Jasmine"
})
