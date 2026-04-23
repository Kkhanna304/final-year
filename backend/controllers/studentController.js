const db = require("../config/db");   // ← THIS LINE WAS MISSING

exports.updateProfile = (req,res)=>{

const email = req.user.email;

const {
age,
phone,
emergency_contact,
year,
father_name,
father_phone,
mother_name,
mother_phone,
city,
state,
pincode
} = req.body;
console.log(req.body)
const sql = `
UPDATE users SET
age=?,
phone=?,
emergency_contact=?,
year=?,
father_name=?,
father_phone=?,
mother_name=?,
mother_phone=?,
city=?,
state=?,
pincode=?
WHERE email=?
`;

db.query(sql,[

age,
phone,
emergency_contact,
year,
father_name,
father_phone,
mother_name,
mother_phone,
city,
state,
pincode,
email

],(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json({message:"Profile updated successfully"});

});

};
exports.uploadPhoto = (req,res)=>{

const email = req.user.email

const photoPath = req.file.filename

const sql = "UPDATE users SET profile_photo=? WHERE email=?"

db.query(sql,[photoPath,email],(err,result)=>{

if(err){
return res.status(500).json(err)
}

res.json({message:"Photo uploaded successfully",photo:photoPath})

})

}
exports.getProfile = (req,res)=>{

const email = req.user.email

const sql = "SELECT * FROM users WHERE email=?"

db.query(sql,[email],(err,result)=>{

if(err) return res.status(500).json(err)

res.json(result[0])

})


}

exports.getDashboard = (req,res)=>{

const email = req.user.email

const sql = `
SELECT
name,
room,
hostel_block,
year,
profile_photo,
pending_amount,
complaints,
leaves_taken
FROM users
WHERE email=?
`

db.query(sql,[email],(err,result)=>{

if(err){
return res.status(500).json(err)
}

res.json(result[0])

})

}