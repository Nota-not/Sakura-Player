# Sakura-Player
USAGE INSTRUCTIONS (For dummies)

Open a file

# 1. Clone your repo

Get the Clone repo from the green "code" Button and press clone repo
go to your terminal(cmd for windows OS) and paste in this command: 
git clone https://github.com/Nota-not/Sakura-Player.git

# 2. Install dependencies
npm install

# 3. Create .env in the project root with YOUR credentials:
Go to the spotify developer website: https://developer.spotify.com/dashboard
sign in and click on "Create an app"
follow instructions to get your client ID and your Client secret
SPOTIFY_CLIENT_ID=their_client_id_here
SPOTIFY_CLIENT_SECRET=their_client_secret_here
REDIRECT_URI=http://127.0.0.1:8888/callback

# 4. Run the app
npm start
