let userID = localStorage.getItem('userID')
let userName = localStorage.getItem('userName');
let userEmail = localStorage.getItem('userEmail');

function getInfo(col, doc) {
    var docRef = db.collection(col).doc(doc);
    let g = docRef.get().then(function (doc) {
        if (doc.exists) {
            g = doc.data();
            console.log(doc.data());
        }
    })
    Promise.all([g, docRef]).then(function (values) {
        console.log(g)
        return g;
    })
}

function titleCase(name) {
    let str = name.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

function setStarredTrackers(userID) {
    let ref = db.doc(`users/${userID}`).get().then(function (doc) {
        let user = doc.data();
        makeStarredTracker(user.favorites);
    })
}

function makeStarredTracker(fav) {
    for (let i = 0; i < fav.length; i++) {
        let favName = fav[i];
        let favButton = document.getElementById(`fav${i + 1}`)
        favButton.onclick = function () {
            localStorage.setItem('subName', favName);
            location.href = "sub.html";
        }
    }
}

function setSubscriptions(userID) {
    let ref = db.doc(`users/${userID}`).get().then(function (doc) {
        let user = doc.data();
        makeSubscriptions(user.subscriptions);
    })
}

function makeSubscriptions(sub) {
    let subLength = sub.length;
    for (let i = 0; i < sub.length; i++) {
        let subName = sub[i];
        let subButton = document.createElement('button');

        subButton.innerHTML = titleCase(sub[i]);
        subButton.class = 'subButton'
        document.getElementById(`sub${i + 1}`).appendChild(subButton);
    }
    let addSub = document.createElement('button');
    addSub.innerHTML = 'Add Subscription';
    addSub.id = 'addSub'
    document.getElementById('subscriptionsWrapper').appendChild(addSub);
}


// Variables for time display and stopwatch
let display = document.getElementById("time");
let startTime, endTime, newTime, timeInterval;
let run = false;

// Record and stop
function countTime(btnID) {
    // If not recording, get start time and change display every sec
    if (!run) {
        startTime = new Date().getTime();
        timeInterval = setInterval(displayTime, 1000);
        run = true;
        document.getElementById(btnID).src = "images/stop.png";
    }
    // If recording, stop, stop display update
    else {
        run = false;
        document.getElementById(btnID).src = "images/record.png";
        clearInterval(timeInterval);
        // Get confirmation if user wants to save time
        if (confirm("Do you want to save this time?")) {
            document.getElementById("time").innerHTML = "";
        }
        else {
            document.getElementById("time").innerHTML = "";
        }
        // Get end time
        endTime = new Date().getTime()
        // Get session time and send to db
        // let sessionTime = Math.floor((endTime - startTime) / 1000);
        // let strSessionTime = sessionTime.toString();
        let sessionTime = endTime - startTime
        updateUserTime(sessionTime, btnID);
    }
}

// Add time to db
function updateUserTime(value, btnID) {
    let date = new Date().toDateString() + " " + new Date().toTimeString();
    let ref = db.doc('users/${userID}').get().then(function (doc) {
        let user = doc.data();
        Promise.all([user, value]).then(function () {
            db.collection("users").doc(`${userID}`).collection(btnID).doc(date).set({
                'time': parseInt(value),
            })
        })
    })
}

// Update time display as stopwatch is running
function displayTime() {
    endTime = new Date().getTime();
    newTime = endTime - startTime;
    let hours = Math.floor((newTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((newTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((newTime % (1000 * 60)) / 1000);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    display.innerHTML = hours + ":" + minutes + ":" + seconds;
}

// Get user ID and name from local storage and display
function displayUserInfo() {
    let userID = localStorage.getItem('userID');
    let userName = localStorage.getItem('userName');
    let userEmail = localStorage.getItem('userEmail');
    document.getElementById("userInfoID").innerHTML = `Hello, ${userName}`;
}


// Go to sub page of the one clicked
function goToSub(subID) {
    window.location.href = "subscriptions.html?" + subID;
}

// Get subID from URL
function getSubID() {
    let subID = window.location.href.split('?')[1];
    document.getElementById("sectionTitle").innerHTML = titleCase(subID) + " Usage Records";
    return subID
}


// Get usage logs from db
function getLogs(userID) {
    let subID = getSubID();
    db.collection("users").doc(`${userID}`).collection(subID).get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            displayUsage(doc.id, doc.data());
        });
    })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}


// Convert usage log to hours, min, sec
function convertTime(time) {
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    usageTime = hours + ":" + minutes + ":" + seconds;
    return usageTime
}

// Calc and display total usage
function totalUsage(userID) {
    let totalTime = 0;
    let subID = getSubID();
    db.collection("users").doc(`${userID}`).collection(subID).get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            totalTime += doc.data()["time"];
        });
        let total = document.createElement("h4");
        total.innerHTML = "TOTAL USAGE:";
        total.className = "total";
        let usageTime = convertTime(totalTime);
        console.log(usageTime);
        let time = document.createElement("h4");
        time.innerHTML = usageTime;
        time.className = "total";
        document.getElementById("date").appendChild(total);
        document.getElementById("usage").appendChild(time);
    }) 
}

// Display usage logs
function displayUsage(id, data) {
    let dataArray = id.split(" ");
    let date = dataArray[1] + " " + dataArray[2] + ", " + dataArray[3];
    let time = convertTime(data["time"]);

    let dayLog = document.createElement("p");
    dayLog.innerHTML = date;
    let usageLog = document.createElement("p");
    usageLog.innerHTML = time;
    document.getElementById("date").appendChild(dayLog);
    document.getElementById("usage").appendChild(usageLog);
}