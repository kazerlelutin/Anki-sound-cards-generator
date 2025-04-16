import csv from 'csv-parser'
import { createReadStream, mkdirSync, rmSync, writeFileSync } from 'fs'
import gTTS from 'gtts'
import path from 'path'
import crypto from 'crypto'
// === config === //
const lang = 'ko'
const langSrcCode = 'fr'
const langDestCode = 'kr'

const results = []

async function main() {

  const args = process.argv.slice(2)
  const isCloze = args.includes('--cloze')
  const clozeReg = /{{c\d+::.*?}}/g

  const rs = await new Promise((resolve) => {
    createReadStream(path.join('in.csv'))
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results)
      })
  })

  // Delete and create the medias folder
  rmSync('medias', { recursive: true })
  mkdirSync('medias', { recursive: true })

  console.log('Processing:', rs)
  const newResults = []
  for (const result of rs) {

    // Nettoyage des ponctuations et suppression des points de fin de phrase
    const sanitizedText = result[langDestCode]
      .replace(/[!@#$%^&*()_=\/\\\+\\"<>;]/g, ' ')
      .replace(/\.$/, '')
      .replace(/{{c\d+::/g, '')
      .replace(/}}/g, '')



    const tts = new gTTS(sanitizedText.replace(/~/g, ' '), lang)

    const cryptoSuffixe = crypto.randomBytes(16).toString('hex')

    const mediaName = `${new Date().getTime()}${cryptoSuffixe}.mp3`

    tts.save(path.join('medias', mediaName), (err) => err && console.error(err))



    const cleanText = result[langDestCode].replace(/"/g, '').trim()

    const tags = result.tags.replace(" ", ",")
    if (isCloze) {
      const words = cleanText.split(' ')

      newResults.push(...words.map((word) => {
        const clozeText = cleanText.replace(word, `{{c1::${word}}}`)
        return {
          recto: `${clozeText} <br><hr />${result[langSrcCode]}`,
          verso: `[sound:${mediaName}]`,
          tags,
        }
      }))
    } else if (result[langDestCode].match(clozeReg)) {

      newResults.push({
        recto: `${cleanText}<br><hr />${result[langSrcCode]}`,
        verso: `[sound:${mediaName}]`,
        tags,
      })
    } else {
      newResults.push({
        recto: `${cleanText}<hr /><br>[sound:${mediaName}]<br>`,
        verso: result[langSrcCode],
        tags,

      })
    }



  }

  let newCsv = ''

  newCsv = newResults
    .map(
      (result) =>
        `${result.recto};${result.verso};${result.tags}`
    )
    .join('\n')


  console.log('New cards ===>', newResults.length)

  writeFileSync('out.csv', newCsv, 'utf-8')
}

main()
