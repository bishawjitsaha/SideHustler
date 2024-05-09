# SideHustler

**VERCEL FRONTEND HOSTED LINK:** [https://sidehustler.vercel.app/](https://sidehustler.vercel.app/)

**ONRENDER BACKEND HOSTED LINK:** [https://sidehustler-backend.onrender.com/home](https://sidehustler-backend.onrender.com/home)


## Dependencies

Download ImageMagick here: [https://imagemagick.org/script/download.php](https://imagemagick.org/script/download.php)
- We used version 7.1.1-32 Q16-HDRI (64-bit) (2024-05-05)
- When installing make sure the following options are checked:
    - "Add Application directory to your system path"
    - "Install legacy utilities (e.g. convert)"

## Database

Database is hosted with a MongoDB Cluster cloud link.
- Images and signup/login are hosted on Firebase
- Link can be found on submission in server/.env
- Anything you edit on localhost will show up on the Vercel deployment

Firebase authentication token expires after an hour of usage for security purposes. 
If things stop loading then, you need to sign-out and sign back in.

# Run It Locally

Open two terminals in the root directory. Make sure the `.env` files are present in both the `client/` and `server/` directories.

**Terminal One:**
```bash
cd server/
npm i
npm run seed
npm start
```
**Terminal Two:**
```bash
cd client/
npm i
npm run dev
```

# Run Frontend Locally with Backend Hosted

Open a terminal in the root directory. Make sure the `.env.local` and `.env.deployed` files are present in the `client/` directory.

```bash
cd  client/
npm  i
./start.sh  --deployed
```

This method can also be used to run everything locally by simply running the backend locally as we did in the previous section (on port 3000) and doing:

```bash
./start.sh --local
```

Enjoy.