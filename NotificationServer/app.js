const express = require('express');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

let savedPushTokensRestaurant = [];
let savedPushTokensUser = [];
const app = express();
app.use(express.json());

//172.26.126.163
const saveToken = (type, token) => {
    if(type){
        console.log('레스토랑 유저')
        if (savedPushTokensRestaurant.indexOf(token === -1)) {
            savedPushTokensRestaurant.push(token);
        }
        return ;
    }
    
    console.log('일반 유저')
    if (savedPushTokensUser.indexOf(token === -1)) {
        savedPushTokensUser.push(token);
    }
}

const handlePushTokens = (message) => {
    let notifications = [];
    for (let pushToken of savedPushTokensRestaurant) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: 'default',
            title: 'Message received!',
            body: message,
            data: { message }
        })
    }
    // Defined in following step
}

app.get('/',(req,res)=>{ res.send('CSH Notification server');})

app.get('/Restaurant/expiryDate', (req, res) => {
    let notifications = [];
    let pushToken;
    for (let x of savedPushTokensRestaurant) {
        if (!Expo.isExpoPushToken(x)) {
            console.error(`Push token ${x} is not a valid Expo push token`);
            continue;
        }
        pushToken = x;
        notifications.push({
            to: x,
            sound: "default",
            title: '유통기한 알림',
            body: '유통기한이 얼마남지 않은 식품이 있습니다.',
            data: {}
        });
    }
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
    res.send(`레스토랑 푸쉬메시지 전송, ${pushToken}`);
});


app.get('/Restaurant/go', (req, res) => {
    let notifications = [];
    let pushToken;
    for (let x of savedPushTokensRestaurant) {
        if (!Expo.isExpoPushToken(x)) {
            console.error(`Push token ${x} is not a valid Expo push token`);
            continue;
        }
        pushToken = x;
        notifications.push({
            to: x,
            sound: "default",
            title: pushToken + '님',
            body: '새로운 메시지.',
            data: {}
        });
    }
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
    res.send(`레스토랑 푸쉬메시지 전송, ${pushToken}`);
});


app.post('/Restaurant', (req, res) => {
    saveToken(true, req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    let notifications = [];
    for (let pushToken of savedPushTokensRestaurant) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        notifications.push({
            to: pushToken,
            sound: "default",
            title: req.body.token.value,
            body: '레스토랑 토큰등록이 완료되었습니다.',
            data: {}
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
    res.send(`Received push token, ${req.body.token.value}`);
});


app.post('/User', (req, res) => {
    saveToken(false,req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    let notifications = [];
    for (let pushToken of savedPushTokensUser) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        notifications.push({
            to: pushToken,
            sound: "default",
            title: req.body.token.value,
            body: '유저 토큰등록이 완료되었습니다.',
            data: {}
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
    res.send(`Received push token, ${req.body.token.value}`);
});


app.get('/User/go', (req, res) => {
    
    let notifications = [];
    let pushToken;
    for (let x of savedPushTokensUser) {
        if (!Expo.isExpoPushToken(x)) {
            console.error(`Push token ${x} is not a valid Expo push token`);
            continue;
        }
        pushToken = x;
        notifications.push({
            to: x,
            sound: "default",
            title: pushToken + '님',
            body: '새로운 메시지.',
            data: {}
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
    res.send(`유저 푸쉬 메시지 전송 ${pushToken}`);
});


app.post('/message', (req, res) => {
    handlePushTokens(req.body.message);
    console.log(`Received message, ${req.body.message}`);
    res.send(`Received message, ${req.body.message}`);
});

app.listen(3000, () => {
    console.log('open expo notification server');
})

