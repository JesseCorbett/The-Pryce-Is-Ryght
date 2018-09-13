const functions = require('firebase-functions')
const fetch = require('node-fetch')

const API_KEY = ""

const baseEtsyUrl = terms => "https://openapi.etsy.com/v2/listings/active?keywords=" + terms + "&limit=10&offset=" + Math.floor(Math.random() * 100) + "&includes=Images:1&api_key="  + API_KEY
const pick = () => Math.floor((Math.random() - 0.001) * 10)

exports.processNewRound = functions.firestore.document('games/{gameId}').onUpdate((change, context) => {
  const newValues = change.after.data()
  const oldValues = change.before.data()

  if ((newValues.started && !oldValues.started) || (newValues.rounds.length > 0 && Object.values(newValues.rounds[newValues.rounds.length - 1]).answers).filter(answer => answer === null).length === 0) {
    console.log("Processing the round")
    const newPlayerStart = newValues.playerStart
    if (newPlayerStart === newValues.players.length) newPlayerStart = 0

    return fetch(baseEtsyUrl("juggalo")).then(result => result.json()).then(result => {
      const picked = result.results[pick()]

      const round = { answers: {}, subjectDescription: picked.title, subjectImage: picked.Images[0].url_fullxfull, subjectPrice: picked.price * 100, subjectUrl: picked.url }
      newValues.players.forEach(id => round.answers[id] = null)

      const rounds = newValues.rounds
      rounds.push(round)

      return change.after.ref.update({
        rounds: rounds,
        playerStart: newPlayerStart
      })
    })
  }

  return true
});
