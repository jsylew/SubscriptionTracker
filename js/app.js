imgsrcs = {
    'spotify': 'images/spotify.png',
    'youtube': 'images/youtube.png',
    'bluejeans': 'images/bluejeans.png',
    'door dash': 'images/doordash.png',
    'netflix': 'images/netflix.png',
    'banana': 'images/banana.png',
    'apple': 'images/apple.png'
};

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

function displayUserName() {
    let userName = localStorage.getItem('userName');
    let userNameStr = document.createElement("p");

    userNameStr.innerHTML = `Name: ${titleCase(userName)}`
    userNameStr.className = 'smallText'
    document.getElementById("userInfoWrapper").appendChild(userNameStr);
}

function displayUserEmail() {
    let userEmail = localStorage.getItem('userEmail');
    let userEmailStr = document.createElement('p');

    userEmailStr.innerHTML = `Email: ${userEmail}`
    userEmailStr.className = 'smallText'
    document.getElementById("userInfoWrapper").appendChild(userEmailStr);
}

function titleCase(name) {
    let str = name.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}