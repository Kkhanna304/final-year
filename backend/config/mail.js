const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: "karankhanna315@gmail.com",
pass: "auml bphh fcok slyj"
}
})

module.exports = transporter