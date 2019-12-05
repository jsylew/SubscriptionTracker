let userID = localStorage.getItem('userID')
let userName = localStorage.getItem('userName');
let userEmail = localStorage.getItem('userEmail');


// Get user ID and name from local storage and display
function displayUserInfo() {
    let userID = localStorage.getItem('userID');
    let userName = localStorage.getItem('userName');
    let userEmail = localStorage.getItem('userEmail');
    document.getElementById("userInfoID").innerHTML = `Hello, ${userName}`;
}

// Make name title case
function titleCase(name) {
    let str = name.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}


function splitSpace(name) {
    name = name.split('%20');
    return name.join(' ');
}

// Star and unstar subs and add/remove from list in db
function favSub(userID) {
    let subID = getSubID();
    let ref = db.doc(`users/${userID}`).get().then(function (doc) { // Reading from the database
        let user = doc.data();
        let userFavList = user.favourites;
        // If userFavList array doesn't exist, create empty one
        if (!userFavList) {
            userFavList = [];
        }
        // Checks if sub is in userFavList, unfav it
        if (userFavList.includes(subID)) {
            for (let i = 0; i < userFavList.length; i++) {
                if (userFavList[i] === subID) {
                    userFavList.splice(i, 1);
                }
            }
            Promise.all([user]).then(function () {
                db.collection("users").doc(`${userID}`).set({ // Writing to the database
                    'favourites': userFavList,
                }, { merge: true })
            })
        }
        // If userFavList already have 3 subs, alert
        else if (userFavList.length === 3) {
            console.log(1);
            alert("You can only star 3 trackers, please unstar one first to continue.")
        }
        // Push sub to userFavList array
        else {
            document.getElementById("star").src = "images/star.png";
            Promise.all([user]).then(function () {
                userFavList.push(subID)
                db.collection("users").doc(`${userID}`).set({ // Writing to the database
                    'favourites': userFavList,
                }, { merge: true })
            })
        }

    })
}

// Control star/unstar
function showStar() {
    let subID = getSubID();
    let ref = db.doc(`users/${userID}`).onSnapshot((function (doc) { // Reading from the database
        let user = doc.data();
        let userFavList = user.favourites;
        // if userFavList doesn't exist, create empty one
        if (!userFavList) {
            userFavList = [];
        }
        // if sub is in userFavList, display star
        if (userFavList.includes(subID)) {
            document.getElementById("star").src = "images/star.png";
        }
        //if sub isn't in userFavList, display unstar
        else {
            document.getElementById("star").src = "images/unstar.png";
        }
    }))
}

// Get favourites from db and pass to create starred trackers
function setStarredTrackers(userID) {
    let ref = db.doc(`users/${userID}`).get().then(function (doc) { // Reading from the database
        let user = doc.data();
        Promise.all([user]).then(function () {
            if (user.favourites) {
                makeStarredTracker(user.favourites);
            }
        })
    })
}

// Create starred trackers on home page
function makeStarredTracker(fav) {
    for (let i = 0; i < Math.min(3, fav.length); i++) {
        let favName = fav[i];
        let favButton = document.getElementById(`starred-${i + 1}`);
        favButton.innerHTML = titleCase(favName);
        favButton.onclick = function () {
            localStorage.setItem('subName', favName);
        }
        document.getElementById(`btn${i + 1}`).id = favName;
    }
}

// Get subscription list from db
function setSubscriptions(userID) {
    let ref = db.doc(`users/${userID}`).onSnapshot(function (doc) { // Reading from the database
        let user = doc.data();
        Promise.all([user]).then(function () {
            if (user.subscriptions) {
                makeSubscriptions(user.subscriptions);
            }
        })
    })
}

// Add sub image to screen with onclick to subpage
function makeSubscriptions(sub) {
    for (let i = 0; i < Math.min(6, sub.length); i++) {
        let subName = sub[i];
        let subButton = document.getElementById(`sub-${i + 1}`);
        document.getElementById(`sub-${i + 1}`).src = `images/${subName}.png`
        subButton.innerHTML = titleCase(subName);
        subButton.onclick = function () {
            localStorage.setItem('subName', subName);
            goToSub(subName);
        }
    }
}

// Variables for time display and stopwatch
let display = document.getElementById("time");
let startTime, endTime, newTime, timeInterval;
let run = false;

// Record and stop
function countTime(btnID) {
    if (btnID == "btn1" || btnID == "btn2" || btnID == "btn3") {
        alert("Star a subscription to track time")
    }
    else {
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

}

// Add time to db
function updateUserTime(value, btnID) {
    let date = new Date().toDateString() + " " + new Date().toTimeString();
    let ref = db.doc('users/${userID}').get().then(function (doc) { // Reading from the database
        let user = doc.data();
        Promise.all([user, value]).then(function () {
            db.collection("users").doc(`${userID}`).collection(btnID).doc(date).set({ // Writing to the database
                'time': parseInt(value),
                'createdDate': new Date().getTime()
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

// Go to sub page of the one clicked
function goToSub(subID) {
    window.location.href = "subscriptions.html?" + subID;
}

// Get subID from URL
function getSubID() {
    let subID = window.location.href.split('?')[1];
    subID = splitSpace(subID)
    document.getElementById("sectionTitle").innerHTML = titleCase(subID) + " Usage Records";
    return subID
}

// Get usage logs from db
function getLogs(userID) {
    let subID = getSubID();
    db.collection("users").doc(`${userID}`).collection(subID).orderBy('createdDate').get().then(function (snapshot) { // Reading the usage logs from the database
        snapshot.forEach(function (doc) {
            displayUsage(doc.id, doc.data());
        });
    })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

//test
function testOrder(userID) {
    let subID = getSubID();
    db.collection("users").doc(`${userID}`).collection(subID).orderByKey()
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

// Calc and display % used
function percentUsed(userID) {
    let subID = getSubID();
    let totalTime = 0;
    let limit = 0;
    db.collection("users").doc(`${userID}`).collection(subID).onSnapshot((function (snapshot) { // Reading the usage logs from the database
        snapshot.forEach(function (doc) {
            let key = Object.keys(doc.data());
            if (key == "limit") {
                limit = doc.data()["limit"];
            }
            if (key != "limit") {
                totalTime += doc.data()["time"];
            }
        });
        let newPercent = (totalTime / limit * 100).toFixed(2) + "%";
        if (newPercent === "NaN%") {
            newPercent = "0%";
        }
        if (newPercent === "Infinity%") {
            newPercent = "No limit"
        }
        document.getElementById("used").innerHTML = newPercent;
        totalTime = 0;
    }));
}

// Calc total usage
function totalUsage(userID) {
    let totalTime = 0;
    let subID = getSubID();
    db.collection("users").doc(`${userID}`).collection(subID).get().then(function (snapshot) { // Reading the usage logs from the database
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
    let usageTime = convertTime(totalTime);
    document.getElementById("total-usage").innerHTML = usageTime;
}

//Show limit
function showLimit(userID) {
    let subID = getSubID();
    let limit = 0;
    db.collection("users").doc(`${userID}`).collection(subID).onSnapshot((function (snapshot) { // Reading the user limit from the database
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

// Clear displayed logs
function clearUsage(id) {
    let div = document.getElementById(id);
    console.log(div);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

// Set usage limt
function setLimit() {
    let subID = getSubID();
    let value = document.getElementById("new-limit").value;
    let ref = db.doc(`users/${userID}`).get().then(function (doc) { // Reading from the database
        let user = doc.data();
        Promise.all([user, value]).then(function () {
            db.collection("users").doc(`${userID}`).collection(subID).doc("limit").set({ // Writing the limit to the database
                'limit': value * 3600000
            }, { merge: true })
        })
    })
    document.getElementById("new-limit").value = "";
    showHide('change-limit', 'limit');
}

// // Get usage logs from db
// function getLogs(userID) {
//     let subID = getSubID();
//     db.collection("users").doc(`${userID}`).collection(subID).get().then(function (snapshot) { // Reading the usage logs from the database
//         snapshot.forEach(function (doc) {
//             let key = Object.keys(doc.data());
//             if (key != "limit") {
//                 displayUsage(doc.id, doc.data());
//             }
//         });
//     })
//         .catch(function (error) {
//             console.log("Error getting documents: ", error);
//         });
// }

// Add sub
function addSub(className) {
    let subID = document.getElementById("newSubName").value;
    let value = document.getElementById("new-limit").value;
    let ref = db.doc(`users/${userID}`).get().then(function (doc) { // Reading the user's subscriptions from the database
        let user = doc.data();
        let userSubList = user.subscriptions;
        if (!userSubList) {
            userSubList = [];
        }
        if (!userSubList.includes(subID)) {
            Promise.all([user, value]).then(function () {
                db.collection("users").doc(`${userID}`).collection(subID).doc("limit").set({ // Writing the user's set limit to the database
                    'limit': value * 3600000
                }, { merge: true })
                userSubList.push(subID)
                db.collection("users").doc(`${userID}`).set({ // Writing to the database
                    'subscriptions': userSubList
                }, { merge: true })
            })
            document.getElementById("instruction").style.display = "none";
        }
        else {
            alert("This subscription already exists.")
        }
    })
    document.getElementById("newSubName").value = "";
    document.getElementById("new-limit").value = "";
    setSubscriptions(userID);
    showHide('instructions', 'add');
}

// Show input
function showHide(show, hide) {
    let showItems = document.getElementsByClassName(show);
    for (let i = 0; i < Object.keys(showItems).length; i++) {
        showItems[i].style.display = "initial";
    }
    let hideItems = document.getElementsByClassName(hide);
    for (let i = 0; i < Object.keys(hideItems).length; i++) {
        hideItems[i].style.display = "none";
    }
}

// Show instruction for new user
function instruction() {
    let ref = db.doc(`users/${userID}`).get().then(function (doc) { // Reading the user's subscriptions from the database
        let user = doc.data();
        let userSubList = user.subscriptions;
        if (!userSubList) {
            let ref = db.doc(`users/${userID}`).get().then(function (doc) { // Reading the user's subscriptions from the database
                let user = doc.data();
                let userSubList = user.subscriptions;
                if (!userSubList) {
                    document.getElementById("instruction").innerHTML = "Add a subscription to begin";
                }
            })
        }
    })
}

// Reset usage logs and clear screen
function reset() {
    let subID = getSubID();
    db.collection("users").doc(`${userID}`).collection(subID).get().then(function (snapshot) { // Reading to the database
        snapshot.forEach(function (doc) {
            if (doc.id != "limit") {
                db.collection("users").doc(`${userID}`).collection(subID).doc(doc.id).delete(); // Deleting documents from the database
            }
            else if (doc.id == "limit") {
                db.collection("users").doc(`${userID}`).collection(subID).doc("limit").set({ // Writing to the database
                    'limit': 0
                }, { merge: true })
                document.getElementById("used").innerHTML = "0%";
            }
        });
    })
    showTotal(0);
    clearUsage("date");
    clearUsage("usage");
}

// Log out
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// Redirect to home
function home() {
    window.location.href = "home.html";
}

// Delete sub
function deleteSub() {
    if (confirm("Are you sure you want to remove this subscription and all its data?")) {
        let subID = getSubID();
        let ref = db.doc(`users/${userID}`).get().then(function (doc) { // Reading from the database
            let user = doc.data();
            let userSubList = user.subscriptions;
            let userFavList = user.favourites;
            let length = userFavList.length;
            Promise.all([user]).then(function () {
                for (let i = 0; i < userSubList.length; i++) {
                    if (userSubList[i] === subID) {
                        userSubList.splice(i, 1);
                    }
                }
                Promise.all([user]).then(function () {
                    db.collection("users").doc(`${userID}`).set({ // Writing to the database
                        'subscriptions': userSubList,
                    }, { merge: true })
                })
            })
            if (userFavList.includes(subID)) {
                for (let i = 0; i < userFavList.length; i++) {
                    if (userFavList[i] === subID) {
                        userFavList.splice(i, 1);
                    }
                }

                Promise.all([user]).then(function () {
                    db.collection("users").doc(`${userID}`).set({ // Writing to the database
                        'favourites': userFavList,
                    }, { merge: true })
                })
            }

            db.collection("users").doc(`${userID}`).collection(subID).get().then(function (snapshot) { // Reading from the database
                snapshot.forEach(function (doc) {
                    db.collection("users").doc(`${userID}`).collection(subID).doc(doc.id).delete(); // Deleting usage logs (documents) from the database
                })
            })
        })
    }
    else {
        console.log("CANCELED");
    }
    setTimeout(function () {
        window.location.href = "home.html";
    }, 500);
}
