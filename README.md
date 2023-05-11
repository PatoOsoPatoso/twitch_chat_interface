<!-- Intro -->
# **TWITCH_CHAT_INTERFACE**
> **Lucas Arroyo Blanco**  
> 
> _PatoOsoPatoso_  

&nbsp; 

<!-- Index -->
# Table of contents
## &nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;)&nbsp;&nbsp;[Description](#description)
## &nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;)&nbsp;&nbsp;[Requeriments](#requirements)
## &nbsp;&nbsp;&nbsp;&nbsp;3&nbsp;)&nbsp;&nbsp;[Modifications to be used](#modifications-to-be-used)  

&nbsp;  
&nbsp; 

<!-- Description -->
## **Description**
This node project generates a simple transparent interface to the right side of the primary display which contains the Twitch chat of the channel username stored inside [index.js](src/index.js)

The interface contains 2 primary views:

1. The first one displays all the messages that arrive.  
   This view has 2 buttons per message:  

   * A button to mark the message as seen and delete it.
   * An other button to mark the message as important and send it to the importants view.  
&nbsp; 

2. This second view contains the important messages.  
   This view only has 1 button per message:

   * A button to mark the message as seen and delete it.  
&nbsp; 

<!-- Requirements -->
## **Requirements**
* **[Node](https://nodejs.org/)**
* **[Electron](https://www.electronjs.org/)**
* **[Tmi.js](https://tmijs.com/)**

After finished the installation of the previous components run the following command in a terminal opened on the project folder.  

**`npm install`**  

This will install the necessary packages to use the project.
&nbsp;  
&nbsp;  
&nbsp;  

<!-- Modifications -->
## **Modifications to be used**
First of all you need to create a .env file in the root folder of the project

Follow this guide to get the credentials https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
```js
CLIENT_ID=1hl5k66dp7eve3iqf6y38krs3ef4a7
CLIENT_SECRET=oeosv3q9obh2vlw9v9yi1gvw65fon1
```

In order to choose which channel are you gonna select you must modify the next part of [index.js](src/index.js).
```js
const client = new tmi.Client({
  connection: { reconnect: true },
  channels: ['patoosopatoso'] // Change this username
});
```
&nbsp;

<!-- Bye bye -->
<img src="https://static.wikia.nocookie.net/horadeaventura/images/c/c2/CaracolRJS.png/revision/latest?cb=20140518032802&path-prefix=es" alt="drawing" style="width:100px;"/>**_bye bye_**