const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.post('/api/run-code', (req, res) => {
  const { code } = req.body;
  const tempFilePath = path.join(__dirname, 'temp_code.py');

  // Write the code to a temporary file
  fs.writeFile(tempFilePath, code, (err) => {
    if (err) {
      return res.json({ output: `Error writing code to file: ${err.message}` });
    }

    // Execute the temporary file
    exec(`python ${tempFilePath}`, (error, stdout, stderr) => {
      // Delete the temporary file
      fs.unlink(tempFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting temporary file:', unlinkErr);
        }
      });

      if (error) {
        return res.json({ output: `Error: ${stderr}` });
      }
      res.json({ output: stdout });
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});