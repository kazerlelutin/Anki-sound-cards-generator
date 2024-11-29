# Anki Sound Card Generator

## Description

Synth [Anki](https://apps.ankiweb.net/) is a tool that generates synthesized audio files and creates Anki cards in the language of your choice (default is Korean, but this can be modified in the code). It reads a CSV file containing expressions to learn and produces audio files associated with each entry, facilitating vocabulary study with Anki.

## Prerequisites

To use this project, you will need:

- Node.js (version 14 or higher)
- npm (or yarn) to manage dependencies

## Installation

Clone the project repository:

```bash
git clone <REPOSITORY-URL>
cd synth-anki
```

## Install the required dependencies:

if you use another package manager like yarn or npm, you can replace pnpm with it and delete the pnpm-lock.yaml file.

```bash
pnpm install
```

## Usage

The project supports CSV files with three main columns:

- Column "fr": Source text in French (modifiable in the code via the langSrcCode and langDestCode variables)
- Column "kr": Target text in Korean
- Column "tags": Tags associated with each Anki card

## To run the script:

Ensure the input file in.csv is present in the root folder of the project.

### Run the generation of cards and audio files:

```bash
npm run generate
```

The script will perform the following actions:

Read the in.csv file and parse each line.

Generate an audio file for each Korean phrase in the medias folder.

Create an output file out.csv containing the Korean phrases along with links to the audio files, ready to be imported into Anki.

CSV Input File Structure

Your in.csv file should have the following format:

```csv
kr,fr,tags
"안녕하세요", "Bonjour", "salutations"
```

kr: The text in Korean (target language)

fr: The translation in French (source language)

tags: The tags you want to associate with each Anki card

## Dependencies

- csv-parser: To parse CSV files

- gTTS: To generate audio files using Google Text-to-Speech

### Output

out.csv: File containing the Korean phrases, French translation, and tags, ready for import into Anki.

medias/: Folder containing the generated audio files, named based on the Korean text.

Running Tests

Currently, this project does not have automated tests. It is planned to extend functionality to include tests in a future version.

## Limitations

This script uses the gTTS service for text-to-speech, which requires an internet connection.

Special characters in the Korean phrases are replaced with underscores when creating audio files.

## Contribution

Contributions are welcome! Feel free to propose suggestions or open issues to improve this project.

## License

This project is licensed under ISC. See the LICENSE file for more details.
