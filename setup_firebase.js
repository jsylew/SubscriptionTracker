var usernamesRef = db.collection('users');

usernamesRef.doc('user 1').set({
    email: "user1@gmail.com",
    name: "Jay",
    nickname: "J1",
    description: "TESTING! I'm using Netflix."
})

usernamesRef.doc('user 2').set({
    email: "user2@gmail.com",
    name: "Jason",
    nickname: "J2",
    description: "testing. I'm using Spotify."
})

usernamesRef.doc('user 3').set({
    email: "user3@gmail.com",
    name: "Jasmine",
    nickname: "J3",
    description: "testing. I'm Netflix, too."
})

var subscriptionsRef = db.collection('users').doc('user 1').collection('subscriptions');

subscriptionsRef.doc('sub 1').set({
    name: "Netflix",
    description: "It's Netflix.",
    favorite: true,
    limit: 6000
})

var usage1Ref = db.collection('users').doc('user 1').collection('subscriptions').doc('sub 1').collection('usages');

usage1Ref.doc('usage 1').set({
    date: "November 1 2019",
    description: "It's Netflix.",
    duration: 4000
})

usage2Ref.doc('usage 2').set({
    date: "November 20 2019",
    description: "It's Netflix.",
    duration: 28391
})