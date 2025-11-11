React Tourism SPA

To run the project, go to tce_frontend directory and run this command:
npm run build

Then cd .. to get back to the main dir...

Navigate to the backend dir.

Run npm run devStart

Note: Inorder to run the project you must add an .env file in your backend dir...
In this format:
.env file example:

MONGO_USER=YOUR-MONGODB-CLUSTER-USERNAME
MONGO_PASS=YOUR-MONGODB-CLUSTER-PASSWORD
MONGO_HOST=johndoe.ftozpky.mongodb.net/
PORT=5000

whereby:
MONGO_URI=mongodb+srv://YOUR-MONGODB-CLUSTER-USERNAME:YOUR-MONGODB-CLUSTER-PASSWORD@johndoe.ftozpky.mongodb.net/

You can choose to use that in that format or just use the URI