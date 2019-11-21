var usernamesRef = db.collection('users');

usernamesRef.doc('user1').set({
    email: "user1@gmail.com",
    name: "Jay",
    nickname: "J1",
    description: "TESTING! I'm using Netflix."
})

usernamesRef.doc('user2').set({
    email: "user2@gmail.com",
    name: "Jason",
    nickname: "J2",
    description: "testing. I'm using Spotify."
})

usernamesRef.doc('user3').set({
    email: "user3@gmail.com",
    name: "Jasmine",
    nickname: "J3",
    description: "testing. I'm Netflix, too."
})

usernamesRef.doc('user4').set({
    email: "user4@gmail.com",
    name: "CHRIS",
    nickname: "PYTHON GOD",
    description: "testing. I'm Netflix, too."
})

var subscriptionsRef = db.collection('users').doc('user1').collection('subscriptions');

subscriptionsRef.doc('sub1').set({
    name: "Netflix",
    description: "It's Netflix.",
    favorite: true,
    limit: 6000
})

var usage1Ref = db.collection('users').doc('user1').collection('subscriptions').doc('sub1').collection('usages');

usage1Ref.doc('usage1').set({
    date: "November 1 2019",
    description: "It's Netflix.",
    duration: 6000
})

usage1Ref.doc('usage2').set({
    date: "November 20 2019",
    description: "It's Netflix.",
    duration: 28391
})