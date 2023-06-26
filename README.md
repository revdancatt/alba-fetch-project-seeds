# alba-fetch-project-seeds
A work around to fetch seeds from an Alba project.

Alba doesn't have a (public) API, and I needed to grab seeds for my FALLiNGWATER project and couldn't be bothered messing around with the OpenSea API. Instead the front-end of Alba grabs the data it needs to make thumbnails and so on with this url...

`https://prod-alba-56s2.encr.app/collections/[project name]/chain/1/page/[page number]`

The webpage for my project is: https://www.alba.art/projects/fallingwater

Making `fallingwater` the project name.

After cloning and `npm init`-ing this project, run the command...

`node index.js fallingwater`

Where `fallingwater` is replaced by the project name you want.

The seeds will be placed in an array and written out to a file in the `data` directory (which will be created).

## Notes

The data returned from Alba also contains other useful stuff, like the features and so on, but you're probably better off using OpenSea for that.

Also, the `prod-alba-56s2.encr.app` part is _very_ likely to change, I should probably put that in a `.env` variable or pass it in on the command line, but for the moment it does the job.
