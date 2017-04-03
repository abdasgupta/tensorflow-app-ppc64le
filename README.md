# tensorflow-app

How To Run
----------

```bash
$ git clone https://github.com/abdasgupta/tensorflow-app-ppc64le.git tensorflow-app
$ cd tensorflow-app/flowers
$ touch package.json
$ npm install express --save
$ npm install shortid --save
$ npm install multer --save
$ npm install command-line-args --save
$ nodejs app.js --inception_client=/your/path/to/inception_client --server=localhost:9000
```

How to run the Dockerfile
-------------------------

```bash
$ docker build -t tf-inception-app-flowers -f Dockerfile .
```
