import csv from 'csv-parser'
import { createReadStream, mkdirSync, rmSync, writeFileSync } from 'fs'
import gTTS from 'gtts'
import path from 'path'

// === config === //
const lang = 'ko'
const langSrcCode = 'fr'
const langDestCode = 'kr'

const results = []

async function main() {
  const rs = await new Promise((resolve) => {
    createReadStream('in.csv')
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results)
      })
  })

  // Delete and create the medias folder
  rmSync('medias', { recursive: true })
  mkdirSync('medias', { recursive: true })

  const newResults = []
  for (const result of rs) {
    const newResult = { ...result }

    const tts = new gTTS(result.kr.replace(/[~,.;\\\/]/g, '_'), lang)
    const cleanName = result.kr.replace(/[~!@#$%^&*()_=\/\\\+\\"?<>.,;]/g, '_')

    tts.save(
      path.join('medias', `${cleanName}.mp3`),
      (err) => err && console.error(err)
    )

    newResult[
      langDestCode
    ] = `"${newResult[langDestCode]}\n[sound:${cleanName}.mp3]"`
    newResults.push(newResult)
  }

  const newCsv = newResults
    .map(
      (result) =>
        `${result[langDestCode]};${result[langSrcCode]};${result.tags}`
    )
    .join('\n')

  console.log('New cards ===>', newResults.length)

  writeFileSync('out.csv', newCsv, 'utf-8')
}

main()
