const express= require('express');
const app= express();
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
          res.redirect(`https://${req.header('host')}${req.url}`);
      } 
          next();
      
  });
}

const cors = require('cors');
const mysql = require('mysql');
const formidable = require('express-formidable');
const nodemailer = require('nodemailer');
// const multer = require('multer');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const session = require("express-session");
require('dotenv').config();
// const helmet = require('helmet');
// app.use(helmet());

// const morgan = require('morgan');
// app.use(morgan('combined'));



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
const PORT=8000;

app.use(cors());

// Specify allowed origins, methods, and headers
app.use(cors({
  origin: 'http://127.0.0.1:5501', // Replace with your client's domain
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
}));  


// var con = mysql.createConnection({
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS
// });

const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



app.use(formidable());
// var con = mysql.createConnection({
//     host: "35.200.243.194",
//     user: "admin_kjsce",
//     password: "uP58a70f#",
//     database: "oet-oehm"
//   });



  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

// const dbConfig = {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// };

// const con = mysql.createPool({ ...dbConfig });
app.use(express.static(path.join(__dirname, 'assets')));

app.post("/getdata",async(req,res)=>{
   
con.connect(function(err) {
  if (err) throw err;
  // console.log("Connected!");
  res.json({"msg":"Connected"});
//   var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
});
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  
  },
  tls: {
    rejectUnauthorized: false
}
});

app.get("/home",async(req,res)=>{
  if(req.session.login==1){
    res.render("home.ejs")
  }else{
    res.render("login.ejs")
  }
})

app.get("/history",async(req,res)=>{
  if(req.session.login==1){
    res.render("student_history.ejs")
  }else{
    res.render("login.ejs")
  }
})

app.get("/online",async(req,res)=>{
  if(req.session.login==1){
    res.render("student_online.ejs")
  }else{
    res.render("login.ejs")
  }
})

app.get("/offline",async(req,res)=>{
  if(req.session.login==1){
    res.render("student_offline.ejs")
  }else{
    res.render("login.ejs")
  }
})

app.get("/",async(req,res)=>{
  res.render("login.ejs")
})

app.post("/login", async(req,res)=>{
  const {email, password} = req.fields;
  console.log(email,password);
  if(email=="Admin@admin.com" && password=="Admin1290"){
    req.session.login=1;
    console.log("login=>",req.session.login)
    res.json({"msg":1})
  }
  else{
    res.json({"msg":0})
  }
})

app.post("/logout",async(req,res)=>{
  req.session.login=0;
  res.json({"msg":1})
})

app.post('/sendCourseLinkRejectEmail', async (req, res) => {
  const {  email, subject, body } = req.fields;

  const mailOptions = {
      from: 'parthtrivedi690@gmail.com',
      to: email,
      subject: subject,
      text: body
  };

  try {
      await transporter.sendMail(mailOptions);
      
      // Here you might want to update your database to mark the application as rejected
      res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.post('/sendRejectionEmail', async (req, res) => {
  const { id, email, subject, body } = req.fields;

  const mailOptions = {
      from: 'parthtrivedi690@gmail.com',
      to: email,
      subject: subject,
      text: body
  };

  try {
      await transporter.sendMail(mailOptions);
      // Here you might want to update your database to mark the application as rejected
      res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});


// app.post("/getCourseDataSem5Oehm",async(req,res)=>{
   
//         con.query("SELECT * FROM courses_offline_oehm where semester= '5'", function (err, result, fields) {
//           if (err) throw err;
//           // console.log(result);
//           res.json({"result":result});
//         });
      
// });

// app.post("/getCourseDataSem5Oet",async(req,res)=>{
   
//   con.query("SELECT * FROM courses_offline_oet where semester= '5'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"result":result});
//   });

// });

// app.post("/getCourseDataSem6Oehm",async(req,res)=>{
   
//   con.query("SELECT * FROM courses_offline_oehm where semester= 6", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"result":result});
//   });

// });

// app.post("/getCourseData",async(req,res)=>{
   
//   con.query("SELECT * FROM courses_offline where "+req.fields.key+"= '"+req.fields.semester+"'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"result":result});
//   });

// });

// app.post("/getCourseDataAll",async(req,res)=>{
   
//   con.query("SELECT * FROM courses_offline ", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"result":result});
//   });

// });


// app.post("/getCourseDataSem6Oet",async(req,res)=>{
   
//   con.query("SELECT * FROM courses_offline_oet where semester= '6'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"result":result});
//   });

// });


// app.post("/getCourseDataSem7Oehm",async(req,res)=>{
   
//   con.query("SELECT * FROM courses_offline_oehm where semester= '7'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"result":result});
//   });

// });


// app.post("/getCourseDataSem7Oet",async(req,res)=>{
   
//   con.query("SELECT * FROM courses_offline_oet where semester= '7'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"result":result});
//   });

// });



// app.post("/getStudentDataSem5OehmOnline", async (req, res) => {
//   try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oehm WHERE semester = '5'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   if (results && results.length > 0) {
//                     resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                 } else {
//                     resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                 }
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/getStudentDataSem6OehmOnline", async (req, res) => {
//   try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oehm WHERE semester = '6'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/getStudentOnlineData", async (req, res) => {
//   try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online WHERE student_id = '"+req.fields.id+"' and semester='"+req.fields.semester+"' and course_type='"+req.fields.type+"'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });
//       console.log(result);
//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/getStudentDataOnline", async (req, res) => {
//   try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oehm WHERE "+req.fields.key+" = '"+req.fields.semester+"'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });





// app.post("/getStudentDataOnlineall", async (req, res) => {
//   try {
//     let query = `SELECT 
//       u.roll_number AS student_id,
//       u.name AS student_name,
//       u.semester,
//       e.course_id,
//       e.type,
//       e.course_approved,
//       c.course_name,
//       c.domain,
//       e.total_hours,
//       u.branch,
//       u.academic_year,
//       u.email,
//       e.course_completed,
//       s.submission_link
//     FROM users u
//     JOIN enrollments e ON u.email = e.email
//     JOIN courses_online c ON e.course_id = c.course_id
//     LEFT JOIN submissions s ON e.course_id = s.course_id AND u.email = s.email
//     WHERE 1=1 AND e.course_completed = 0 AND u.active = 1`;
//     const { semester, branch, courseType, apprej } = req.fields;
//     if (semester && semester !== "--Select Semester--") {
//       query += ` AND u.semester = '${semester}'`;
//     }
//     if (courseType && courseType !== "--Select Course Type--") {
//       query += ` AND e.type = '${courseType}'`;
//     }
//     if (branch && branch !== "--Select Branch--") {
//       query += ` AND u.branch = '${branch}'`;
//     }
//     console.log(apprej);
//     if (apprej && apprej === "approval") {
//       query += ` AND e.course_approved = 0`;
//     }
//     if (apprej && apprej === "approved") {
//       query += ` AND e.course_approved = 1`;
//     }
//     console.log("Query is =", query);
//     const result = await new Promise((resolve, reject) => {
//       con.query(query, function (err, result, fields) {
//         if (err) reject(err);
//         resolve(result);
//       });
//     });
//     const studentData = {};
//     result.forEach(student => {
//       console.log(student.semester)
//       const key = `${student.email.trim()}_${student.type}_${student.semester.trim()}`;
//       if (!studentData[key]) {
//         studentData[key] = {
//           id: student.id,
//           student_id: student.student_id,
//           student_name: student.student_name,
//           semester: student.semester,
//           email: student.email,
//           year:student.academic_year,
//           course_approved: student.course_approved,
//           courses_type: student.type,
//           course_rejected: student.course_rejected,
//           courses_enrolled: "",
//           courses_links: "",
//           domain: "",
//           total_hours: "",
//           final_hours: 0,
//           branch: student.branch,
//           completion_status: student.course_completed === 1 ? "Completed" : "Not Completed",
//           completion_colour: student.course_completed === 1 ? "success" : "danger"
//         };
//       }

//       studentData[key].courses_enrolled += (student.course_name || "N/A") + "<br>";
//       studentData[key].courses_links += `<input type="checkbox" class="checkbox" value="${student.course_name}"><a href="${student.courses_links || '#'}">${student.courses_links || "No links found"}</a><br>`;
//       studentData[key].domain += (student.domain || "N/A") + "<br>";
//       studentData[key].total_hours += (student.total_hours || "N/A") + "<br>";
//       studentData[key].final_hours += (parseInt(student.total_hours) || 0);
//     });
//     const formattedData = Object.values(studentData);
//     console.log("Formatted Data:", formattedData);
//     res.json({ result: formattedData });
//   } catch (err) {
//     console.error("Error retrieving data:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/getStudentDataOnlineall", async (req, res) => {
  try {
    let query = `
      SELECT 
        u.roll_number AS student_id,
        u.name AS student_name,
        u.semester,
        e.course_id,
        e.type,
        e.course_approved,
        c.course_name,
        c.domain,
        e.total_hours,
        u.branch,
        u.academic_year,
        u.email,
        e.course_completed,
        s.submission_status,
        s.submission_link
      FROM users u
      JOIN enrollments e ON u.email = e.email
      JOIN courses_online c ON e.course_id = c.course_id
      LEFT JOIN submissions s ON e.course_id = s.course_id AND u.email = s.email
      WHERE 1=1 AND e.course_completed = 0 AND u.active = 1 
    `;
    const { semester, branch, courseType, apprej } = req.fields;
    if (semester && semester !== "--Select Semester--") {
      query += ` AND u.semester = '${semester}'`;
    }
    if (courseType && courseType !== "--Select Course Type--") {
      query += ` AND e.type = '${courseType}'`;
    }
    if (branch && branch !== "--Select Branch--") {
      query += ` AND u.branch = '${branch}'`;
    }
    if (apprej && apprej === "approval") {
      query += ` AND e.course_approved = 0`;
    }
    if (apprej && apprej === "approved") {
      query += ` AND e.course_approved = 1`;
    }
    const result = await new Promise((resolve, reject) => {
      con.query(query, function (err, result, fields) {
        if (err) reject(err);
        resolve(result);
      });
    });
    const studentData = {};
    result.forEach(student => {
      const key = `${student.email.trim()}_${student.type}_${student.semester.trim()}`;
      if (!studentData[key]) {
        studentData[key] = {
          id: student.id,
          student_id: student.student_id,
          student_name: student.student_name,
          semester: student.semester,
          email: student.email,
          year: student.academic_year,
          course_approved: student.course_approved,
          courses_type: student.type,
          course_rejected: student.course_rejected,
          courses_enrolled: "",
          courses_links: "",
          domain: "",
          submission_status:student.submission_status,
          total_hours: "",
          final_hours: 0,
          branch: student.branch,
          completion_status: student.course_completed === 1 ? "Completed" : "Not Completed",
          completion_colour: student.course_completed === 1 ? "success" : "danger"
        };
      }

      studentData[key].courses_enrolled += (student.course_name || "N/A") + "<br>";
      studentData[key].courses_links += `<a href="${student.submission_link || '#'}">${student.submission_link || "No links found"}</a><br>`;
      studentData[key].domain += (student.domain || "N/A") + "<br>";
      studentData[key].total_hours += (student.total_hours || "N/A") + "<br>";
      studentData[key].final_hours += (parseInt(student.total_hours) || 0);
    });
    const formattedData = Object.values(studentData);
    res.json({ result: formattedData });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/rejectCertificate",async(req,res)=>{
  const {email,courses_links}=req.fields;
  console.log("rejected",courses_links)
  const query = `UPDATE  submissions set submission_status='rejected' WHERE email = '${email}' AND submission_link in (${courses_links})`;
  console.log("Reject Query is =>",query)
  con.query(query,function(err,result,fields){
    if(err) throw err;
    console.log("rejected",result);
    res.json({"rejected":true})
  })
})

app.post("/getYear",async(req,res)=>{
  try {
    query="select academic_year from users limit 1";
    con.query(query, function(err,result,fields){
      if(err) throw err;
      console.log(result[0].academic_year);
      res.json({result:result[0].academic_year});
    })
  }catch(e){
    console.log(e);
  }
})

app.post("/changeAcademicYear",async(req,res)=>{
  const {year} = req.fields;
  const query = `UPDATE users SET academic_year = "${year}" WHERE   1`;
  con.query(query, function (err, result, fields) {
    if (err) throw err;
    console.log("Academic Year Changed");
    res.json({result:1})
  })
})

// app.post("/getStudentDataOfflineAll", async (req, res) => {
//   try {
//     let query = `
//       SELECT
//         u.email,
//         e.course_id,
//         u.name as student_name,
//         u.roll_number,
//         u.branch,
//         c.course_name,
//         c.faculty_name,
//         c.faculty_email,
//         e.course_approved,
//         e.type,
//         e.enrolled_semester,
//         e.enrolled_academic_year
//       FROM users u
//       JOIN enrollments e ON u.email = e.email
//       JOIN courses_offline c ON e.course_id = c.course_code
//       WHERE u.active = 1 AND e.course_completed = 0
//     `;

//     const { semester, branch, courseType, apprej } = req.fields;

//     if (semester && semester !== "--Select Semester--") {
//       query += ` AND e.enrolled_semester = '${semester}'`;
//     }

//     if (courseType && courseType !== "--Select Course Type--") {
//       query += ` AND e.type = '${courseType}'`;
//     }

//     if (branch && branch !== "--Select Branch--") {
//       query += ` AND u.branch = '${branch}'`;
//     }

//     // if (apprej === "approval") {
//     //   query += ` AND e.course_approved = 0`;
//     // } else if (apprej === "approved") {
//     //   query += ` AND e.course_approved = 1`;
//     // }

//     console.log("Query is =", query);
    
//     const result = await new Promise((resolve, reject) => {
//       con.query(query, function (err, result, fields) {
//         if (err) reject(err);
//         console.log(result);
//         resolve(result);
//       });
//     });

//     res.json(result);
//   } catch (error) {
//     console.error("Error in getStudentDataOfflineAll:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/getStudentDataOfflineAll", async (req, res) => {
  try {
    // Construct SQL query
    let query = `
      SELECT
        u.email,
        e.course_id,
        u.name AS student_name,
        u.roll_number,
        u.branch,
        c.course_name,
        c.faculty_name,
        c.faculty_email,
        e.course_approved,
        e.type,
        e.enrolled_semester,
        e.enrolled_academic_year
      FROM users u
      JOIN enrollments e ON u.email = e.email
      JOIN courses_offline c ON e.course_id = c.course_code
      WHERE u.active = 1 AND e.course_completed = 0
    `;

    // Extract filters from request
    const { semester, branch, courseType, apprej } = req.fields;

    // Apply filters to the query
    if (semester && semester !== "--Select Semester--") {
      query += ` AND e.enrolled_semester = '${semester}'`;
    }

    if (courseType && courseType !== "--Select Course Type--") {
      query += ` AND e.type = '${courseType}'`;
    }

    if (branch && branch !== "--Select Branch--") {
      query += ` AND u.branch = '${branch}'`;
    }

    console.log("Query is =", query);

    // Execute the query
    const result = await new Promise((resolve, reject) => {
      con.query(query, function (err, result, fields) {
        if (err) reject(err);
        resolve(result);
      });
    });

    // Prepare data with preferences
    const studentDataWithPreferences = [];
    const emailPreferenceMap = {};

    result.forEach((row) => {
      const email = row.email;
      const type = row.type;

      // Initialize preference counter and last type for each student if not exists
      if (!emailPreferenceMap[email]) {
        emailPreferenceMap[email] = {
          preferenceCounter: 0,
          lastType: null,
        };
      }

      // Reset preference if type changes
      if (emailPreferenceMap[email].lastType !== type) {
        emailPreferenceMap[email].preferenceCounter = 0;
      }

      // Increment preference counter
      emailPreferenceMap[email].preferenceCounter += 1;

      // Update last type
      emailPreferenceMap[email].lastType = type;

      studentDataWithPreferences.push({
        email: row.email,
        course_id: row.course_id,
        student_name: row.student_name,
        roll_number: row.roll_number,
        branch: row.branch,
        course_name: row.course_name,
        faculty_name: row.faculty_name,
        faculty_email: row.faculty_email,
        course_approved: row.course_approved,
        type: row.type,
        enrolled_semester: row.enrolled_semester,
        enrolled_academic_year: row.enrolled_academic_year,
        preference: emailPreferenceMap[email].preferenceCounter, // Add preference number
      });
    });

    console.log(studentDataWithPreferences);

    res.json(studentDataWithPreferences);

  } catch (error) {
    console.error("Error in getStudentDataOfflineAll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/downloadData",async(req,res)=>{
  let query="delete from enrollments where mode='offline' and course_approved=0";
  const result = await new Promise((resolve, reject) => {
    con.query(query, function (err, result, fields) {
      if (err) reject(err);
      resolve(result);
    });
  });
  res.json({"msg":1})
})

app.post("/deleteStudentDataOffline",async(req,res)=>{
  try{
  const {email,id,type,semester}=req.fields;
  let query=`delete from enrollments where mode='offline'  and email='${email}' and course_id='${id}' and type='${type}' and enrolled_semester='${semester}'`;
  const result = await new Promise((resolve, reject) => {
    con.query(query, function (err, result, fields) {
      if (err) reject(err);
      resolve(result);
    });
  });
  res.json({"deleted":1})
}catch(e){
  res.json({"deleted":0})
}
})


app.post("/updateStudentDataOffline",async(req,res)=>{
  try{
    console.log("hello update")
  const {email,roll,branch,id,type,semester,oldType,oldId}=req.fields;
  console.log(id)
  let query=`Update  enrollments set course_id='${oldId}',type='${type}'  where mode='offline'  and email='${email}'  and type='${oldType}' and enrolled_semester='${semester}' and course_id='${id}'`;
  console.log(query)
  const results = await new Promise((resolve, reject) => {
    con.query(query, function (err, result, fields) {
      if (err) reject(err);
      resolve(result);
    });
  });
  let querys=`Update  users set roll_number='${roll}' where  email='${email}' `;
  console.log(querys)
  const results2 = await new Promise((resolve, reject) => {
    con.query(querys, function (err, result, fields) {
      if (err) reject(err);
      resolve(result);
    });
  });
  console.log("roll=>",results2)
  res.json({"updated":1})
}catch(e){
  console.error("Error in updateStudentDataOffline:", e);
  res.json({"updated":0})
}
})

app.post("/getCourseIdOffline",async(req,res)=>{
  try{
  const {courseName}=req.fields;
  let query=`select course_code from courses_offline where course_name='${courseName}'`;
  const results = await new Promise((resolve, reject) => {
    con.query(query, function (err, result, fields) {
      if (err) reject(err);
      resolve(result);
    });
  });
  console.log("result=>",results)
  res.json({"id":results})
}catch(e){
  res.json({"msg":"NO Course"})
}
})



app.post("/getStudentDataOnlineallCompleted", async (req, res) => {
  try {
    let query = `
      SELECT
        u.roll_number AS student_id,
        u.name AS student_name,
        u.semester,
        e.course_id,
        e.type,
        e.course_approved,
        c.course_name,
        c.domain,
        e.enrolled_semester,
        e.total_hours,
        u.branch,
        u.email,
        e.course_completed,
        s.submission_link
      FROM users u
      JOIN enrollments e ON u.email = e.email
      JOIN courses_online c ON e.course_id = c.course_id
      LEFT JOIN submissions s ON e.course_id = s.course_id AND u.email = s.email
      WHERE 1=1 AND e.course_completed=1 AND u.active=1
    `;

    const { semester, branch, courseType, apprej } = req.fields;

    if (semester && semester !== "--Select Semester--") {
      query += ` AND e.enrolled_semester = '${semester}'`;
    }
    if (courseType && courseType !== "--Select Course Type--") {
      query += ` AND e.type = '${courseType}'`;
    }
    if (branch && branch !== "--Select Branch--") {
      query += ` AND u.branch = '${branch}'`;
    }
    if (apprej && apprej === "approval") {
      query += ` AND e.course_approved = 0`;
    }
    if (apprej && apprej === "approved") {
      query += ` AND e.course_approved = 1`;
    }

    console.log("Query is =", query);

    const result = await new Promise((resolve, reject) => {
      con.query(query, function (err, result, fields) {
        if (err) reject(err);
        resolve(result);
      });
    });

    const studentData = {};

    result.forEach(student => {
      // Use enrolled_semester instead of semester for the key
      const key = `${student.email.trim()}_${student.type}_${student.enrolled_semester.trim()}`;

      if (!studentData[key]) {
        studentData[key] = {
          id: student.id,
          student_id: student.student_id,
          student_name: student.student_name,
          semester: student.enrolled_semester,
          email: student.email,
          course_approved: student.course_approved,
          courses_type: student.type,
          course_rejected: student.course_rejected,
          courses_enrolled: [],
          courses_links: [],
          domain: [],
          total_hours: [],
          final_hours: 0,
          branch: student.branch,
          completion_status: student.course_completed === 1 ? "Completed" : "Not Completed",
          completion_colour: student.course_completed === 1 ? "success" : "danger"
        };
      }

      studentData[key].courses_enrolled.push(student.course_name || "N/A");
      studentData[key].courses_links.push(student.submission_link || "No links found");
      studentData[key].domain.push(student.domain || "N/A");
      studentData[key].total_hours.push(student.total_hours || "N/A");
      studentData[key].final_hours += (parseInt(student.total_hours) || 0);
    });

    const formattedData = Object.values(studentData).map(student => ({
      ...student,
      courses_enrolled: student.courses_enrolled.join("<br>"),
      courses_links: student.courses_links.map(link => `<a href="${link}">${link}</a>`).join("<br>"),
      domain: student.domain.join("<br>"),
      total_hours: student.total_hours.join("<br>")
    }));

    console.log("Formatted Data:", formattedData);
    res.json({ result: formattedData });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/resetSem",async (req,res)=>{
  con.query("UPDATE users SET semester = CASE WHEN semester = 'V' THEN 'VI' WHEN semester = 'VI' THEN 'VII' ELSE semester END where active=1",async function(err,result,fields) {
    if (err) throw err;
    console.log("Reset Sem");
    res.json({result:1})
  })
})

const axios = require('axios');
const crypto = require('crypto');

const WEBHOOK_URL = 'https://oet-oehm-preprod-ingvj2pida-el.a.run.app/webhook/trigger-reonboarding';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "SM3MvcSjjBKySAPStk8rWarMhcazQ6cT"; // Same secret as in the student system

async function triggerReonboarding(userEmail) {
  const payload = JSON.stringify({ userEmail });
  
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  try {
    const response = await axios.post(WEBHOOK_URL, { userEmail }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature
      }
    });
    console.log("response");
    console.log("Response : ",response.data)
    return response.data;
  } catch (error) {
    console.error('Error triggering re-onboarding:', error);
    throw error;
  }
}


app.post("/approve",async (req,res)=>{
  const query=`UPDATE enrollments SET course_approved=1 WHERE email="${req.fields.email}" and enrolled_semester="${req.fields.semester}" and type="${req.fields.type}"`
  console.log("query is ",query)
  con.query(query,async function(err,result,fields) {
    if (err) throw err;
    console.log("Reset Sem");
    res.json({result:1})
  });
})

app.post("/completeStudentDataOnline",async (req,res)=>{
  const query=`UPDATE submissions SET submission_status='Accepted' WHERE email="${req.fields.email}" and submission_link in (${req.fields.courses_links})`
  console.log("query is ",query)
  con.query(query,async function(err,result,fields) {
    if (err) throw err;
    console.log("Reset Sem");
    res.json({result:1})
  });
})

app.post("/webhook/trigger-reonboarding",async (req,res)=>{

  console.log(req.fields.email);
  userEmail = req.fields.userEmail;
  // console.log(req.firlds)
  // const query=`UPDATE enrollments SET course_rejected=1 WHERE email="${req.fields.userEmail}" and enrolled_semester="${req.fields.semester}" and type="${req.fields.type}"`
  // console.log("query is ",query)
  // con.query(query,async function(err,result,fields) {
  //   if (err) throw err;
  //   res.json({result:true})
  // });
  // console.log(userEmail)
  try {
    const result = await triggerReonboarding(userEmail);
    console.log(result)
    res.json({"result":result.success});
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger re-onboarding' });
  }
})


// app.post("/getSubjectDataOffline", async (req, res) => {
//   try {
//       let query = "SELECT * FROM courses_offline WHERE 1=1"; // Initial query
     
//       const { semester, courseType, branch } = req.fields; // Assuming the frontend sends the selected filters in the request body
//       console.log("semester is ",semester);
//       if (semester && semester !== "--Select Semester--") {
//           query += ` AND semester = '${semester}'`;
//       }

//       if (courseType && courseType !== "--Select Course Type--") {
//           query += ` AND course_type = '${courseType}'`;
//       }

//       if (branch && branch !== "--Select Branch--") {
//           query += ` AND branch = '${branch}'`;
//       }
//       console.log("Query is =",query);
//       const result = await new Promise((resolve, reject) => {
//           con.query(query, function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

     
//       res.json({ "result": result });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// async function autoAllocateOfflineCourses() {
//   const query = util.promisify(con.query).bind(con);

//   try {
//     console.log("Starting auto-allocation process");

//     // Fetch all students with offline course preferences
//     const students = await query(`
//       SELECT DISTINCT e.email, e.enrolled_semester
//       FROM enrollments e
//       WHERE e.mode = 'OFFLINE'
//     `);
//     //console.log(Found ${students.length} students with offline preferences);

//     // Fetch all offline courses
//     const courses = await query(`
//       SELECT course_id, type, enrolled_semester
//       FROM enrollments
//       WHERE mode = 'OFFLINE'
//       GROUP BY course_id, type, enrolled_semester
//     `);

//     // Initialize course allocation counts
//     const courseCounts = {};
//     courses.forEach(course => {
//       courseCounts[course.course_id] = 0;
//     });

//     // Initialize student allocations
//     const studentAllocations = {};
//     students.forEach(student => {
//       studentAllocations[student.email] = { OET: null, OEHM: null };
//     });

//     // Process each student's preferences
//     for (const student of students) {
//       //console.log(Processing preferences for student: ${student.email});
      
//       // Fetch student's preferences in the order they were inserted
//       const preferences = await query(
//         `
//         SELECT course_id, type
//         FROM enrollments
//         WHERE email = ? AND mode = 'OFFLINE' AND enrolled_semester = ?
//         `,
//         [student.email, student.enrolled_semester]
//       );

//      // console.log(Preferences for ${student.email}:, preferences.map(p => p.course_id).join(', '));

//       for (const pref of preferences) {
//         const courseType = pref.type; // 'OET' or 'OEHM'
        
//         // Skip if student already allocated for this course type
//         if (studentAllocations[student.email][courseType]) continue;

//         // Check if course is available for student's semester
//         const course = courses.find(c => c.course_id === pref.course_id && c.enrolled_semester === student.enrolled_semester);
//         if (!course) continue;

//         // Allocate if course count is less than 20
//         if (courseCounts[pref.course_id] < 20) {
//           courseCounts[pref.course_id]++;
//           studentAllocations[student.email][courseType] = pref.course_id;
//          // console.log(Allocated ${courseType} course ${pref.course_id} to ${student.email});
//         }

//         // Break if both OET and OEHM are allocated
//         if (studentAllocations[student.email].OET && studentAllocations[student.email].OEHM) break;
//       }
//     }

//     // Filter out courses with less than 20 students
//     const viableCourses = Object.entries(courseCounts)
//       .filter(([courseId, count]) => count >= 20)
//       .map(([courseId]) => courseId);

//     console.log("Viable courses:", viableCourses);

//     // Final allocation and cleanup
//     for (const [email, allocation] of Object.entries(studentAllocations)) {
//       //console.log(Finalizing allocation for student: ${email});
      
//       const approvedCourses = [];
//       for (const type of ['OET', 'OEHM']) {
//         if (allocation[type] && viableCourses.includes(allocation[type])) {
//           approvedCourses.push(allocation[type]);
//           //console.log(Approving ${type} course ${allocation[type]} for ${email});
//           const updateResult = await query(
//             `
//             UPDATE enrollments
//             SET course_approved = 1
//             WHERE email = ? AND course_id = ? AND type = ? AND mode = 'OFFLINE'
//           `,
//             [email, allocation[type], type]
//           );
//           //console.log(Update result: ${JSON.stringify(updateResult)});
//         }
//       }

//       // Remove all unapproved courses for this student
//      // console.log(Removing unapproved courses for ${email});
//       let deleteQuery;
//       let deleteParams;
//       if (approvedCourses.length > 0) {
//         deleteQuery = `
//           DELETE FROM enrollments
//           WHERE email = ? AND mode = 'OFFLINE' AND course_id NOT IN (?)
//         `;
//         deleteParams = [email, approvedCourses];
//       } else {
//         deleteQuery = `
//           DELETE FROM enrollments
//           WHERE email = ? AND mode = 'OFFLINE'
//         `;
//         deleteParams = [email];
//       }
      
//       try {
//         const deleteResult = await query(deleteQuery, deleteParams);
//        // console.log(Delete result: ${JSON.stringify(deleteResult)});
//       } catch (error) {
//        // console.error(Error deleting unapproved courses for ${email}:, error);
//       }
//     }

//     console.log("Auto-allocation completed successfully");
//     return { success: true, message: "Auto-allocation completed successfully" };
//   } catch (error) {
//     console.error("Error during auto-allocation:", error);
//     return {
//       success: false,
//       message: "Error during auto-allocation",
//       error: error.message,
//     };
//   }
// }

// app.post("/api/auto-allocate-offline-courses", async (req, res) => {
//   try {
//     const result = await autoAllocateOfflineCourses();
//     res.json(result);
//   } catch (error) {
//     console.error("Error in auto-allocation process:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error in auto-allocation process",
//       error: error.message,
//     });
//   }
// });







// app.post("/getCourseOehmData",async(req,res)=>{
//   console.log(req.fields.id);
//   con.query("SELECT * FROM courses_offline_oehm WHERE course_id = '"+req.fields.id+"'", function (err, result, fields) {
//     if (err) throw err;
//     res.json({"result":result});
// });
// });


// app.post("/getStudentOehmOnlineData",async(req,res)=>{
//   console.log(req.fields.id);
// try {
//   const result = await new Promise((resolve, reject) => {
//     con.query("SELECT * FROM students_online_oehm WHERE student_id = '" + req.fields.id + "'", function (err, result, fields) {
//       console.log(result[0].course_id);
//       if (err) throw err;
//       con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [result[0].course_id], function (err, courses, fields) {
//         console.log(courses);
//           if (err) throw err;
//           resolve({"result": result, "courses": courses}); 
//       });
//   });
//   });

// } catch (err) {
//   console.error("Error retrieving data:", err);
//   res.status(500).json({ error: "Internal server error" });
// }
// });

// app.post("/getCourseOetData",async(req,res)=>{
//   console.log(req.fields.id);
//   con.query("SELECT * FROM courses_offline_oet WHERE course_id = '"+req.fields.id+"'", function (err, result, fields) {
//     if (err) throw err;
//     res.json({"result":result});
// });
// });

// app.post("/editOehmCourse",async(req,res)=>{
//   con.query("UPDATE courses_offline SET course_id = '" + req.fields.course_id + "', course_name = '" + req.fields.course_name + "', faculty_name = '" + req.fields.faculty_name + "', semester = '" + req.fields.semester + "', faculty_email = '" + req.fields.faculty_email + "' WHERE course_id='"+req.fields.course_id+"' and course_type='OEHM'", function (err, result, fields) {
//     if (err) throw err;
//     console.log("result is" + result);
//     res.json({"updated": "yes"});
// });

// });



// app.post("/editOnlineStudent", async (req, res) => {
//   const { student_id, course_type, semester, course_id, course_name,student_name,total_hours,completion } = req.fields;
  
//   con.query("UPDATE students_online SET course_id = ?,student_name=?  ,total_hours=?  , semester = ?,course_completed=? WHERE student_id = ? AND course_type = ? AND semester = ?", 
//   [course_id,student_name,total_hours , semester, student_id, course_type, semester,completion], 
//   function (err, result, fields) {  
//       if (err) {
//           console.error("Error updating student online data:", err);
//           res.status(500).json({ error: "An error occurred while updating student online data" });
//           return;
//       }
//       console.log("Updated student online data:", result);
//       res.json({ "updated": "yes" });
//   });
// });





// app.post("/editOetCourse",async(req,res)=>{
//   con.query("UPDATE courses_offline SET course_id = '" + req.fields.course_id + "', course_name = '" + req.fields.course_name + "', faculty_name = '" + req.fields.faculty_name + "', semester = '" + req.fields.semester + "', faculty_email = '" + req.fields.faculty_email + "' WHERE course_id='"+req.fields.course_id+"' and course_type='OET'", function (err, result, fields) {
//     if (err) throw err;
//     console.log("result is" + result);
//     res.json({"updated": "yes"});
// });

// });


// app.post("/getStudentDataSem6OetOnline", async (req, res) => {
//   try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oet WHERE semester = '6'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   if (results && results.length > 0) {
//                     resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                 } else {
//                     resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                 }
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/getStudentDataSem5OetOnline", async (req, res) => {
//   try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oet WHERE semester = '5'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   if (results && results.length > 0) {
//                     resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                 } else {
//                     resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                 }
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/getStudentDataSem7OetOnline", async (req, res) => {
//   try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oet WHERE semester = '7'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   if (results && results.length > 0) {
//                     resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                 } else {
//                     resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                 }
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/getStudentDataSem7OehmOnline", async (req, res) => {
//   try {
//       const result = await new Promise((resolve, reject) => {
//           con.query("SELECT * FROM students_online_oehm WHERE semester = '7'", function (err, result, fields) {
//               if (err) throw err;
//               resolve(result);
//           });
//       });

//       const courseDetailsPromises = result.map(student => {
//           return new Promise((resolve, reject) => {
//               con.query("SELECT course_name, Domain FROM courses_online WHERE course_id = ?", [student.course_id], function (err, results, fields) {
//                   if (err) throw err;
//                   if (results && results.length > 0) {
//                     resolve({ course_name: results[0].course_name, domain: results[0].Domain });
//                 } else {
//                     resolve({ course_name: "N/A", domain: "N/A" }); // Provide default values or handle empty results
//                 }
//               });
//           });
//       });

//       const courseDetails = await Promise.all(courseDetailsPromises);

//       res.json({ "result": result, "course": courseDetails });
//   } catch (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.post("/deleteStudentDataOnline",async(req,res)=>{
//   // console.log(req.fields.id);
//  con.query("delete FROM students_online WHERE student_id='"+req.fields.id+"' and semester='"+req.fields.semester+"'", function (err, result, fields) {
//    if (err) throw err;
//    // console.log("result is"+result);
//    res.json({"deleted":"yes"});
//  });

// });

// app.post("/deleteStudentDataSem5OehmOnline",async(req,res)=>{
//    // console.log(req.fields.id);
//   con.query("delete FROM students_online_oehm WHERE student_id="+req.fields.id+"", function (err, result, fields) {
//     if (err) throw err;
//     // console.log("result is"+result);
//     res.json({"deleted":"yes"});
//   });

// });

// app.post("/deleteStudentDataSem5OetOnline",async(req,res)=>{
   
//   con.query("delete FROM students_online_oet WHERE student_id='"+req.fields.id+"'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"deleted":"yes"});
//   });

// });


// app.post("/deleteSubjectData",async(req,res)=>{
//    // console.log("subject_id"+req.fields.id);
//   con.query("delete FROM courses_offline WHERE course_id='"+req.fields.id+"' and semester='"+req.fields.semester+"' and course_type='"+req.fields.type+"'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"deleted":"yes"});
//   });

// });

// app.post("/deleteSubjectDataSem5Oet",async(req,res)=>{
//   // console.log("subject_id"+req.fields.id);
//  con.query("delete FROM courses_offline_oet WHERE course_id='"+req.fields.id+"'", function (err, result, fields) {
//    if (err) throw err;
//    // console.log(result);
//    res.json({"deleted":"yes"});
//  });
// });


// app.post("/addOehmCourse",async(req,res)=>{
//   console.log("in add course");
//  con.query("INSERT INTO courses_offline_oehm(course_id, course_name, faculty_name, semester, faculty_email) VALUES ('"+req.fields.course_id+"','"+req.fields.course_name+"','"+req.fields.faculty_name+"','"+req.fields.semester+"','"+req.fields.faculty_email+"')", function (err, result, fields) {
//    if (err) throw err;
//     console.log("result is"+result);
//    res.json({"inserted":"yes"});
//  });
// });

// app.post("/addOetCourse",async(req,res)=>{
//   console.log("in add course");
//  con.query("INSERT INTO courses_offline_oet(course_id, course_name, faculty_name, semester, faculty_email) VALUES ('"+req.fields.course_id+"','"+req.fields.course_name+"','"+req.fields.faculty_name+"','"+req.fields.semester+"','"+req.fields.faculty_email+"')", function (err, result, fields) {
//    if (err) throw err;
//     console.log("result is"+result);
//    res.json({"inserted":"yes"});
//  });
// });

// app.post("/deleteStudentDataSem6OetOnline",async(req,res)=>{
   
//   con.query("delete FROM students_online_oet WHERE student_id='"+req.fields.id+"'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"deleted":"yes"});
//   });

// });


// app.post("/deleteStudentDataSem7OetOnline",async(req,res)=>{
   
//   con.query("delete FROM students_online_oet WHERE student_id='"+req.fields.id+"'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"deleted":"yes"});
//   });

// });




// app.post("/getCourseDataSem5Oet",async(req,res)=>{
   
//   con.query("SELECT * FROM courses_offline_oet where semester= '5'", function (err, result, fields) {
//     if (err) throw err;
//     // console.log(result);
//     res.json({"result":result});
//   });

// });





app.listen(PORT,(err)=>{
    if(err)
    {
         // console.log("Something went wrong");
    }
    else
    {
         // console.log("Server Succesfully started on Port :",PORT);
    }
})