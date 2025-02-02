import mongoose from "mongoose"
import "dotenv/config";
import app from "./app.js"

const {DB_HOST, PORT} = process.env; 

mongoose.connect(DB_HOST)
  .then(()=>{
    app.listen(PORT, () => {
      // console.log(`Server running. Use our API on port: ${PORT}`)
      console.log("Database connection successful")
    })
  })
  // .catch(process => console.log(process.exit(1)))
  .catch(error => console.log(error.message))

