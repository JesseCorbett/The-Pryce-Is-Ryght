const functions = require('firebase-functions')
const fetch = require('node-fetch')

const API_KEY = "5z4cm376tbtt9cpv3ec3yaj2"

const baseEtsyUrl = terms => "https://openapi.etsy.com/v2/listings/active?keywords=" + terms + "&limit=200&includes=Images:1&api_key="  + API_KEY
const pick = size => Math.floor((Math.random() - 0.00001) * size)

const topics = ["juggalo", "otherkin", "haunted doll", "anthro", "fetish"]
const topic = () => topics[Math.floor(Math.random() * topics.length)]

exports.processNewRound = functions.firestore.document('games/{gameId}').onUpdate(change => {
  const newValues = change.after.data()
  const oldValues = change.before.data()

  if ((newValues.started && !oldValues.started) || (newValues.rounds.length > 0 && Object.values(newValues.rounds[newValues.rounds.length - 1].answers).filter(answer => answer === null).length === 0)) {
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
}).catch(() => getResult(change, game, newPlayerStart))
