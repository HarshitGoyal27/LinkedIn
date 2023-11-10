const axios = require('axios');

const url = 'https://api.scrapingdog.com/linkedin/';
const params = {
    api_key: '654a2093d336b708a598818f',
    type: 'profile',
    linkId: 'harshit-goel-a407ab1b5'
};

axios.get(url, { params: params })
    .then(response => {
        if (response.status === 200) {
            const data = response.data;
            console.log(data);
        } else {
            console.log(`Request failed with status code: ${response.status}`);
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
