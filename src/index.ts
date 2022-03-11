const { Elm } = require('./Main.elm');

const mountNode = document.getElementById('elm-app');

const app = Elm.Main.init({ node: mountNode });