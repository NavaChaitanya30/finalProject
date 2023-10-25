const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3002; 
const { PythonShell } = require('python-shell');
// const upload = multer({ dest: 'public/uploads/' });
const fs = require('fs');
const csv = require('csv-parser');


// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public')); // Serve static files like styles.css

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads'); // Directory for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });

const upload = multer({ dest: 'public/uploads/' });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/simulation', (req, res) => {
    res.sendFile(__dirname + '/public/simulation.html');
  });
  app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/public/form2.html');
  });
  app.get('/dataset', (req, res) => {
    res.sendFile(__dirname + '/public/dataset.html');
  });
  app.post('/packet', (req, res) => {
    // Get form data from the request
    const formData = req.body;
    console.log('Received form data:', formData);
  
    // Create a new PythonShell instance
    const pyshell = new PythonShell('py_scripts/predict.py', {
      pythonPath: 'python3', // Use python3 if necessary
      args: [JSON.stringify(formData)],
    });
    
    // Listen for data from the Python script
    // Initialize the newIntruder object
    const newIntruder = {
      ipAddress: formData.SourceIP, // Modify as needed
      attackType: '',
      timeStamp: new Date().toISOString(),
    };
    console.log('newIntruder object initialized:', newIntruder);
  
    // Listen for messages from the Python script
    pyshell.on('message', (message) => {
      // Set the attackType field in newIntruder based on the Python script output
      newIntruder.attackType = message;
      console.log('Received message from Python script:', message);
      
      // Send the newIntruder object as JSON response
      res.json(newIntruder);
    });
  
    // Handle errors that occur during script execution
    pyshell.on('error', (error) => {
      console.error('Python script error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });
  

app.get('/register',(req,res)=>{
  res.sendFile(__dirname + '/public/register.html');
});

// app.post('/upload', upload.single('file'), (req, res) => {
//   if (req.file) {
//     // Define the path to save the uploaded file
//     const filePath = req.file.path;

//     // Read the uploaded CSV or XLSX file and count the rows
//     let rowCount = 0;
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', () => {
//         rowCount++;
//       })
//       .on('end', () => {
//         // Rename the file and move it to the public/uploads folder
//         const newFilePath = `public/uploads/${req.file.originalname}`;
//         fs.rename(filePath, newFilePath, (err) => {
//           if (err) {
//             console.error('Error moving the file:', err);
//             res.status(500).send('Error moving the file');
//           } else {
//             res.send(`Number of rows in the uploaded dataset: ${rowCount}`);
//           }
//         });
//       });
//   } else {
//     res.send('No file selected');
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
