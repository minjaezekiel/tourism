require("dotenv").config()
const express = require('express')
const helmet = require("helmet")
const app = express()
const cors = require("cors")
const path = require("path")
const connectDB = require("./config/dbconfig")
const port = process.env.PORT||3000
const frontendPath = path.join(__dirname, './../tce_frontend/dist')
const user = require("./models/users")
//const contact = require("./models/contacts")
const contactRouter = require("./routes/contacts.routes")
const userRouter = require('./routes/user.routes')
const blogRouter = require("./routes/blog.routes")
const testimonialsRouter = require('./routes/testimonial.routes')
//const router = express.Router()

//connecting to database...
//connectDB()

//middleware
//allow use of cors on debug mode 
app.use(cors()) 
//app.use(helmet())
app.use(express.json()) 
//app.use(router)
//serving static files from the dist dir...(frontend build)
app.use(express.static(frontendPath,{index:false}))
/*
* Even this opt works...does same thing as app.use(express.static(frontendPath,{index:false}))
app.use('/assets', express.static(path.join(frontendPath, 'assets')));
*/


/*app.get("/",(req,res)=>{
  res.send("<h1>Hello world</h1>")
  console.log('working')
})*/

//creating a user
const createUser = async ()=>{
try{
  const newUser =new user(
  {
    first_name: "LightOne",
    last_name: "Admin",
    username: "lightoneadmin",
    email: "lightoneadmin@gmail.com",
    password: "123456789",
    isAdmin: true
  }
)
await newUser.save()
console.log(`New user created: \n ${newUser}`)
}catch(err){
  console.error(`Error creating user: \n ${err}`)
}
} 
//createUser();

const createContact = async ()=>{
  try{
const newContact = await contact.create(
  {
    fullname: "Ezekiel Minja",
    email: 'ezekielminja@gmail.com', 
    phone: '0658520839', 
    tour: 'kilimanjaro', 
    message: 'Hlw'
  }
)
console.log(`Contact saved successfully: \n ${newContact}`)
  }catch(e){
    console.error(`Failed to create contact: \n ${e.message}`)
  }
}
//createContact()



//routes
//app.use("/admin",loginRouter)
app.use('/users',(req,res,next)=>{console.log("Users route working"),next()},userRouter)
app.use("/contactUs", contactRouter,(req,res,next)=>{console.log("Contact route working"),next()})
app.use("/blog",blogRouter)
app.use('/testimonials', testimonialsRouter);
/*router.route("/contactUs").post(async(req,res)=>{
try{
const {name, email, phone, tour, message} = req.body

const newContact = await contact.create(
  {
    fullname: name,
    email: email,
    phone: phone,
    tour: tour,
    message: message
  }
)

console.log(`New contact saved successfully,\n${newContact}`)

res.status(201).json({
  message: `Contact saved successfully:`,
  data: newContact})
}catch(e){
  console.error(`Failed to save contact \n ${e}`)
  
  res.status(500).json({ message: "Failed to save contact", error: e.message })
}
})*/


/*
 *splat matches any path without the root path. If you need to match the root 
 * path as well /, you can use /{*splat}, wrapping the wildcard in braces.
 * for more info, read expressjs docs 
 * */
app.get('/{*splat}', (req, res) => {
  //console.log("Catch-all route hit. Sending file:", path.join(frontendPath, "index.html"));
  res.sendFile(path.join(frontendPath, "index.html"));
}); 

const startServer = async () => {
  try {
    // waiting for the database to connect
    await connectDB();
    console.log("Database connected successfully!\nNow running operations...");

    // 2.  it's safe to run your function
    //await createContact(); 
    //await createUser()
    
    app.listen(3000, () => {
      console.log('App listening on port 127.0.0.1:3000/');
    });

  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1); // Exit if we can't connect to the DB
  }
};

//to run the server, type in command prompt npm run devStart
//note that you must be in the same directory as the backend/server.js
/*app.listen(port, () => {
  console.log(`Example app listening on port 127.0.0.1:${port}/`)
})*/
startServer()
