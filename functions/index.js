const functions = require('firebase-functions')
const admin = require('firebase-admin');

const fetch = require('node-fetch')

const API_KEY = ""

const baseEtsyUrl = terms => "https://openapi.etsy.com/v2/listings/active?keywords=" + terms + "&limit=200&includes=Images:1&api_key="  + API_KEY
const pick = size => Math.floor((Math.random() - 0.00001) * size)

const topics = ["juggalo", "otherkin", "haunted doll", "anthro", "fetish"]
const topic = () => topics[Math.floor(Math.random() * topics.length)]


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings)

exports.processNewRound = functions.firestore.document('games/{gameId}').onUpdate(change => {
  const newValues = change.after.data()
  const oldValues = change.before.data()

  if (newValues.readyForNewRound && ! oldValues.readyForNewRound) {
    let newPlayerStart = newValues.playerStart + 1
    if (newPlayerStart === newValues.players.length) newPlayerStart = 0

    return getResult(change, newValues, newPlayerStart)
  }

  return true
});

const getResult = (change, game, newPlayerStart) => fetch(baseEtsyUrl(topic())).then(result => result.json()).then(result => {
  const picked = result.results[pick(result.results.length)]

  const round = { answers: {}, subjectDescription: picked.title, subjectImage: picked.Images[0].url_fullxfull, subjectPrice: picked.price * 100, subjectUrl: picked.url }
  game.players.forEach(id => round.answers[id] = null)

  const rounds = game.rounds
  rounds.push(round)

  return change.after.ref.update({
    rounds: rounds,
    playerStart: newPlayerStart,
    readyForNewRound: false
  })
})


// exports.checkOwnerAck = functions.firestore.document('games/{gameId}').onUpdate((change, context) => {
//   const newValues = change.after.data()
//   const oldValues = change.before.data()

//   if (newValues.owner !== oldValues.owner || newValues.ownerAck !== oldValues.ownerAck) {
//     return true
//   }

//   console.log("Checking if owner disconnected")

//   const timestamp = Date.now()
//   return db.collection('/games').doc(context.params.gameId).get().then(ref => {
//     const lastAck = ref.data().ownerAck

//     console.log("Now: " + timestamp)
//     console.log("Last Ack: " + lastAck)

//     if (timestamp > lastAck) {
//       console.log("Owner disconnected")

//       if (newValues.playerCount === 1) {
//         return change.after.ref.update({
//           active: false,
//           players: []
//         })
//       }

//       const newPlayers = newValues.players.filter(playerId => playerId !== newValues.owner)
      
//       return change.after.ref.update({
//         players: newPlayers,
//         playerCount: newPlayers.length,
//         owner: newPlayers[0]
//       })
//     }
//   })
// });