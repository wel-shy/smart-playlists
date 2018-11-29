# Smart Playlists

Create smart playlists for Spotify!
> only supporting 'Recently Added' at the moment.

## Setup
### Get the code:
Clone the repo:
```bash
git clone https://github.com/wel-shy/smart-playlists.git && cd smart-playlists
```

### Install dependencies:
Run the commands
```bash
npm install && npm run build
```

### Add Environment Variables 
Set the environment variables for the application to use. Create the file `.env`
at the root of the project and add the following:
```bash
CLIENT_ID=<SPOTIFY_CLIENT_ID>
CLIENT_SECRET=<SPOTIFY_SECRET>
REDIRECT_URL=<CALLBACK_URL>
PORT=<PORT>
HOST=<HOST_URL>
```

You can get an id and secret from spotify by registering your application at the developer
console. Add your callback url here and make sure they match exactly.

### Login to Spotify:
Run:
```bash
npm run auth
```
Then go to `<HOST_URL>:<PORT>` and click login.

You're ready to use the app!

## Run
Enter the command:
```bash
npm run execute
```

This will update your recently added playlist.