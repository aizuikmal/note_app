
# Aizu Notes
This is a self-hosted web app. You can write note in it. Can become your own personal pastebin, note inbox, to jot something quickly from your website.

View demo here: https://notes-demo.aizu.my/

## Getting Started

Download this app into your server, and run it.

### Prerequisites

What things you need to install the software and how to install them

```
apt-get install nodejs
```

### Installing

First, ensure you have NodeJS installed in the machine. Then, clone this repo to your machine.

Clone repo

```
git clone https://github.com/aizuikmal/note_app.git
```

First, you need to configure environment to use which AWS S3 bucket, Access Key & Secret.
```
vim .env
```
The content for the .env file
```
AWS_ACCESSKEY=xxxxxxx
AWS_SECRET=xxxxxxxxxxxxx
AWS_S3_BUCKET=xxxxxxxx
```
Important note: you need to create a new file named "contents.json" containing "{}" (without double quote) in your S3 bucket. [NEED FIX]

Then, you have to install all the Node packages requirements
```
npm install
```
Then, if you running as development, run the command below.
```
npm run dev
```
If you running as production, run build and start.
```
npm run build
npm run start
```
By default, it will run on port number 3000.

Go to https://yourserver:3000

To change to different port, run next with -p flag
```
next start -p 5000
```

## Built With

* [NextJS]([https://nextjs.org/](https://nextjs.org/)) - The web framework used


## Authors

* **Aizu Ikmal**

Thanks to my buddies, teach me how to code NodeJS, React & NextJS.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Buddies
