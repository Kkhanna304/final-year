const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// serve uploaded images
app.use("/uploads", express.static("uploads"))

const authRoutes = require("./routes/authRoutes")
const studentRoutes = require("./routes/studentRoutes")

app.use("/api/auth", authRoutes)
app.use("/api/student", studentRoutes)

app.listen(5000,()=>{
console.log("Server running on port 5000")
})