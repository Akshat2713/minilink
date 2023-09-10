const $ = (x, all, elm = document) => all ? elm.querySelectorAll(x) : elm.querySelector(x);

import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions"

const firebaseConfig = {
    apiKey: "AIzaSyBD5qlJ5u7XDosCLbriQpXuhMM7rI-H8ok",
    authDomain: "minilinkss.firebaseapp.com",
    projectId: "minilinkss",
    storageBucket: "minilinkss.appspot.com",
    messagingSenderId: "1056082147165",
    appId: "1:1056082147165:web:a452bea01e2dd47d825ab4"
};

const app = initializeApp(firebaseConfig);

const functions = getFunctions()
const shortenLink = httpsCallable(functions, 'shortenLink')

$('#link-shorten-button').onclick = e => {
    shortenLink({
        service: $('[name=service]:checked').value,
        url: $('#link-shorten-field').value
    }).then(x => {
        $('.shortened-link').textContent = x.data;
        console.log(x.data);
        $('.dialog').classList.toggle('opened')
    })
}

$('#share-link').onclick = e => {
    navigator.share({ title: `Check out this URL`, url: $('.shortened-link').textContent })
}

$('#copy-link').onclick = e => {
    navigator.clipboard.writeText($('.shortened-link').textContent)
}

