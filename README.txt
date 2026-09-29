PLATNIUMAI BOT STATUS CONTROLLER

IMPORTANT: This project contains a Netlify Function. A drag-and-drop static deploy of only the public folder will NOT deploy the function, and the controller will fail with a 502/404.

Deploy using one of these methods:
1) Put the ENTIRE contents of this folder in a GitHub repository and connect that repository to Netlify; or
2) Use Netlify CLI from this folder: npm install, then npx netlify deploy --build --prod.

Netlify build settings:
- Base directory: (leave blank)
- Build command: (leave blank)
- Publish directory: public
- Functions directory: netlify/functions

Set environment variable ADMIN_PASSWORD in the Netlify site settings. Make sure its scope includes Functions, then redeploy.

Controller URL: https://platniumai-bot.netlify.app
Public status endpoint: https://platniumai-bot.netlify.app/status.json
Main website should read that endpoint.
