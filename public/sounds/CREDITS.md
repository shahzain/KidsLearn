# Sound credits

The animal & bird recordings in this folder are downloaded by
`npm run fetch-sounds` (see `scripts/fetch-sounds.mjs`) from these open,
community "animal soundboard" projects on GitHub:

- **ridhurshan/Animal-Soundboard** — https://github.com/ridhurshan/Animal-Soundboard
- **andanylo/AnimalSoundboard** — https://github.com/andanylo/AnimalSoundboard

These upstream projects do **not** publish a formal license for their audio, so
the clips are included here for **personal / educational** use only.

> ⚠️ **Before distributing this app commercially or publicly**, review the
> licensing of each clip and/or replace them with sounds you have the rights to
> — e.g. CC0 clips from https://freesound.org or public-domain recordings from
> https://commons.wikimedia.org.

## Replacing / adding sounds

Drop an MP3 named `<id>.mp3` into this folder (the `id` matches the item ids in
[`src/data/animals.ts`](../../src/data/animals.ts) and
[`src/data/birds.ts`](../../src/data/birds.ts)), then run `npm run build`.

Giraffe, rabbit, penguin and toucan are (near-)silent or lack an iconic call, so
they have no recording and simply say their name with a short friendly phrase.
