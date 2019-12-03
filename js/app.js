let userID = localStorage.getItem('userID')
let userName = localStorage.getItem('userName');
let userEmail = localStorage.getItem('userEmail');

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
        endTime = new Date().getTime()
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
    usageTime = convertTime(newTime);
    display.innerHTML = usageTime;
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
            let key = Object.keys(doc.data());
            if (key != "limit") {
                displayUsage(doc.id, doc.data());
            }
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


// Show limit
// function showLimit(userID) {
//     let subID = getSubID();
//     let limit = 0;
//     db.collection("users").doc(`${userID}`).collection(subID).get().then(function (snapshot) {
//         snapshot.forEach(function (doc) {
//             let key = Object.keys(doc.data());
//             if (key == "limit") {
//                 limit += doc.data()["limit"];
//             }
//         });
//         let userLimit = convertTime(limit);
//         document.getElementById("usage-limit").innerHTML = userLimit;
//     })
// }

function showLimit(userID) {
    let subID = getSubID();
    let limit = 0;
    db.collection("users").doc(`${userID}`).collection(subID).onSnapshot((function (snapshot) {
        snapshot.forEach(function (doc) {
            let key = Object.keys(doc.data());
            if (key == "limit") {
                limit = doc.data()["limit"];
            }
        });
        userLimit = convertTime(limit);
        document.getElementById("usage-limit").innerHTML = userLimit;
    }))
}


// Calc and display % used
function percentUsed(userID) {
    let subID = getSubID();
    let totalTime = 0;
    let percent;
    let limit = 0;
    db.collection("users").doc(`${userID}`).collection(subID).onSnapshot((function (snapshot) {
        snapshot.forEach(function (doc) {
            let key = Object.keys(doc.data());
            if (key == "limit") {
                limit += doc.data()["limit"];
            }
            if (key != "limit") {
                totalTime += doc.data()["time"];
            }
        });
        let newPercent = (totalTime / limit * 100).toFixed(2) + "%";
        document.getElementById("used").innerHTML = newPercent;
    }));
}

// Calc total usage
function totalUsage(userID) {
    let totalTime = 0;
    let subID = getSubID();
    db.collection("users").doc(`${userID}`).collection(subID).get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            let key = Object.keys(doc.data());
            if (key != "limit") {
                totalTime += doc.data()["time"];
            }
        });
        showTotal(totalTime);
    })
}

// Display total usage
function showTotal(totalTime) {
    let total = document.createElement("h4");
    total.innerHTML = "TOTAL USAGE:";
    total.className = "total";
    let usageTime = convertTime(totalTime);
    let time = document.createElement("h4");
    time.innerHTML = usageTime;
    time.className = "total";
    document.getElementById("total-left").appendChild(total);
    document.getElementById("total-right").appendChild(time);
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

// Set usage limt
function setLimit() {
    let subID = getSubID();
    let value = document.getElementById("new-limit").value;
    let ref = db.doc('users/${userID}').get().then(function (doc) {
        let user = doc.data();
        Promise.all([user, value]).then(function () {
            db.collection("users").doc(`${userID}`).collection(subID).doc("limit").set({
                'limit': value * 3600000
            }, { merge: true })
        })
    })
    document.getElementById("new-limit").value = "";
    hideInput();
}

// Show set limit input
function showInput() {
    document.getElementById("change-limit").style.display = "none";
    let items = document.getElementsByClassName("limit");
    for (let i = 0; i < Object.keys(items).length; i++) {
        items[i].style.display = "initial";
    }
}


// Hide set limit input
function hideInput() {
    document.getElementById("change-limit").style.display = "initial";
    let items = document.getElementsByClassName("limit");
    for (let i = 0; i < Object.keys(items).length; i++) {
        items[i].style.display = "none";
    }

    return str.join(' ');
}

function setStarredTrackers(userID) {
    let ref = db.doc(`users/${userID}`).get().then(function (doc) {
        let user = doc.data();
        Promise.all([user]).then(function () {
            if (user.favorites) {
                makeStarredTracker(user.favorites);
            }
        })
    })
}

function makeStarredTracker(fav) {
    for (let i = 0; i < Math.min(3, fav.length); i++) {
        let favName = fav[i];
        let favButton = document.getElementById(`starred-${i + 1}`);
        favButton.innerHTML = titleCase(favName);
        favButton.onclick = function () {
            localStorage.setItem('subName', favName);
            location.href = "sub.html";
        }
        document.getElementById(`btn${i + 1}`).id = favName;
    }
}

function setSubscriptions(userID) {
    let ref = db.doc(`users/${userID}`).onSnapshot(function (doc) {
        let user = doc.data();
        Promise.all([user]).then(function () {
            if (user.subscriptions) {
                makeSubscriptions(user.subscriptions);
            }
        })
    })
}

function makeSubscriptions(sub) {
    for (let i = 0; i < Math.min(6, sub.length); i++) {
        let subName = sub[i];
        let subButton = document.getElementById(`sub-${i + 1}`);
        document.getElementById(`sub-${i + 1}`).src = `images/${subName}.png`
        subButton.innerHTML = titleCase(subName);
        subButton.onclick = function () {
            localStorage.setItem('subName', subName);
            location.href = "sub.html";
        }
    }
}

function setAddButton() {
    let subButton = document.getElementById('sub-6');
    subButton.src = 'images/add.png'
    subButton.onclick = function () {
        let sub = prompt("Enter a sub");
        if (sub) {
            let subLimit = prompt("Enter a limit (in hours)");
            if (subLimit) {
                sub = sub.toLowerCase();
                addSub(sub, subLimit);
            }
        }
    }
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
    let subID = subName;
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

function setTitle(subTitle) {
    let titleStr = document.createElement('p');
    titleStr.innerHTML = `${titleCase(subTitle)} Usage Records`;
    document.getElementById('sectionTitle').appendChild(titleStr);
}

function setSubImage(subTitle) {
    let appImage = document.createElement('img');
    appImage.src = `images/${subTitle}.png`;
    appImage.id = 'appImage';
    document.getElementById('imageWrapper').appendChild(appImage);
}

function timeHistory() {
    myHistory += document.write(mySub + " " + myDate + " " + myTime + " seconds");
}

// Add sub
function addSub(className) {
    let subID = document.getElementById("newSubName").value;
        console.log(subID);
    let value = document.getElementById("new-limit").value;
        console.log(value);
    let ref = db.doc(`users/${userID}`).get().then(function (doc) {
        let user = doc.data();
        let userSubList = user.subscriptions;
        Promise.all([user, value]).then(function () {
            db.collection("users").doc(`${userID}`).collection(subID).doc("limit").set({
                'limit': value * 3600000
            }, { merge: true })
            userSubList.push(subID)
            db.collection("users").doc(`${userID}`).set({
                'subscriptions': userSubList
            }, { merge: true })
        })
    })
    document.getElementById("newSubName").value = "";
    document.getElementById("new-limit").value = "";
    setSubscriptions(userID)
    // hideInput(className);
}

// // Show add sub input
// function showInput(className) {
//     document.getElementById("add-sub").style.display = "none";
//     let items = document.getElementsByClassName(className); // This should make this usable for your part too
//     for (let i = 0; i < Object.keys(items).length; i++) {
//         items[i].style.display = "initial";
//     }
// }


// // Hide add sub input
// function hideInput(className) {
//     document.getElementById("add-sub").style.display = "initial";
//     let items = document.getElementsByClassName(className); // Same as above
//     for (let i = 0; i < Object.keys(items).length; i++) {
//         items[i].style.display = "none";
//     }
// }

