# ShaRit (Still in brainstorming and development).
  - p2p Share magnet link application.
  - Real time actualizations via socket.io
  - Real time webs and other nodes db sync.
  - Customizable and modular.
  
# How to start

  - CLONE THE REPOSITORY
  - npm install
  - node app.js

# Adding new posts
  - open http://localhost:80/
  - postman to http://localhost:80/api/upload with the next body
  
  ```json
  {
  "title" : "A very special title",
  "imgLink": "http://someimage.com/something.png",
  "magnet" : "magnet:?xt=urn:sha1:PDAQRAOQQRYS76MRZJ33LK4MMVZBDSCL",
  "description" : "Put some description here"
}
```
  - Readdy, u can see real time posting in your web, and if there is another one in other server connected and peeared u can see it in that too. :)

If u are interested in make contributions, you are welcome :)
