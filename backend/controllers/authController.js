const db = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const transporter = require("../config/mail")

let otpStore = {}

// =============================
// REGISTER
// =============================
exports.register = async (req,res)=>{

const {name,email,password} = req.body

try{

const hashedPassword = await bcrypt.hash(password,10)

const sql = "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)"

db.query(sql,[name,email,hashedPassword,"student"],(err,result)=>{

if(err){
return res.status(500).json(err)
}

res.json({message:"Student registered successfully"})

})

}
catch(error){
res.status(500).json(error)
}

}


// =============================
// LOGIN
// =============================
exports.login = (req,res)=>{

const {email,password} = req.body

const sql = "SELECT * FROM users WHERE email=?"

db.query(sql,[email],async(err,result)=>{

if(err){
return res.status(500).json(err)
}

if(result.length === 0){
return res.status(400).json({message:"Invalid credentials"})
}

const user = result[0]

const isMatch = await bcrypt.compare(password,user.password)

if(!isMatch){
return res.status(400).json({message:"Invalid credentials"})
}

const token = jwt.sign(
{
email:user.email,
role:user.role
},
"SECRETKEY",
{expiresIn:"1d"}
)

res.json({
token,
role:user.role
})

})

}


// =============================
// SEND OTP
// =============================
exports.sendOTP = async (req,res)=>{

const {email} = req.body

const sql = "SELECT * FROM users WHERE email=?"

db.query(sql,[email], async (err,result)=>{

if(err){
return res.status(500).json(err)
}

if(result.length === 0){
return res.status(404).json({message:"Email not registered"})
}

const otp = Math.floor(100000 + Math.random()*900000)

otpStore[email] = {
otp: otp,
expires: Date.now() + 5*60*1000,
verified:false
}

const mailOptions = {
from: "yourgmail@gmail.com",
to: email,
subject: "Password Reset OTP",
text: `Your OTP is ${otp}`
}

try{

await transporter.sendMail(mailOptions)

res.json({message:"OTP sent successfully"})

}
catch(error){

console.log(error)
res.status(500).json({message:"Email sending failed"})

}

})

}


// =============================
// VERIFY OTP
// =============================
exports.verifyOTP = (req,res)=>{

const {email,otp} = req.body

if(!otpStore[email]){
return res.status(400).json({message:"OTP not found"})
}

if(otpStore[email].otp != otp){
return res.status(400).json({message:"Invalid OTP"})
}

if(Date.now() > otpStore[email].expires){
return res.status(400).json({message:"OTP expired"})
}

otpStore[email].verified = true

res.json({message:"OTP verified"})

}


// =============================
// RESET PASSWORD
// =============================
exports.resetPassword = async (req,res)=>{

const {email,password} = req.body

if(!otpStore[email] || !otpStore[email].verified){
return res.status(400).json({message:"OTP verification required"})
}

const hashedPassword = await bcrypt.hash(password,10)

const sql = "UPDATE users SET password=? WHERE email=?"

db.query(sql,[hashedPassword,email],(err,result)=>{

if(err){
return res.status(500).json(err)
}

delete otpStore[email]

res.json({message:"Password updated successfully"})

})

}