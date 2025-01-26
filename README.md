# Remote Procedure Call (RPC) Implementation

## **What is RPC?**

Remote Procedure Call (RPC) is a protocol that allows a program to execute procedures or methods on a remote server as if they were local functions. RPC abstracts the complexity of network communication, enabling seamless interactions between a client and a server on different machines.

## **What Are We Doing Here?**

In this project, we:

1. Implement an RPC system where clients can invoke remote methods (e.g., `factorial` and `sum`) hosted on a server.
2. Host the server on one machine (e.g., Ubuntu) and the client interface on another machine (e.g., Windows) in the same network.
3. Demonstrate how users can:
   - Compute the factorial of a number.
   - Compute the summation of two numbers.

## **How to Run This on Two Different Machines (Machine 1 and Machine 2)**

This guide assumes you have:

- Machine 1: Server (Ubuntu)
- Machine 2: Client (Windows)
- Both machines connected to the same network.

### **Step 1: Setting Up the Server on Machine 1 (Ubuntu)**

1. **Install Node.js** Ensure Node.js is installed on the Ubuntu machine. If not, install it using:

   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

2. **Prepare the Server Files**

   - Create a folder for the server, e.g., `RPC-Server`.
   - Add the `server.js` file to the folder with the following content:
     ```javascript
     const express = require('express');
     const cors = require('cors');
     const app = express();

     const PORT = 3000;
     const corsOptions = {
         origin: true,
         credentials: true,
     };

     app.use(express.json());
     app.use(cors(corsOptions));

     function factorial(n) {
         if (n === 0 || n === 1) return 1;
         return n * factorial(n - 1);
     }

     function sum(a, b) {
         return a + b;
     }

     app.post('/rpc', (req, res) => {
         const { method, params } = req.body;
         console.log(`Received RPC request: ${method}(${params})`);

         let result;

         switch (method) {
             case 'factorial':
                 result = factorial(params[0]);
                 break;
             case 'sum':
                 result = sum(params[0], params[1]);
                 break;
             default:
                 return res.status(400).json({ error: 'Invalid method' });
         }

         console.log(`Result: ${result}`);
         res.json({ result });
     });

     app.listen(PORT, '0.0.0.0', () => {
         console.log(`RPC Server is running on http://0.0.0.0:${PORT}`);
     });
     ```

3. **Start the Server** Run the server using Node.js:

   ```bash
   node server.js
   ```

   The server will start at `http://0.0.0.0:3000`.

4. **Find the IP Address of Machine 1** Run the following command to find the machine's IP address:

   ```bash
   ip a
   ```

   Look for the IP under the `inet` field of your active network interface (e.g., `192.168.0.109`).

### **Step 2: Setting Up the Client on Machine 2 (Windows)**

1. **Prepare the Client Files**

   - Create a folder for the client, e.g., `RPC-Client`.
   - Add the `index.html` file with the following content:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>RPC Client</title>
         <style>
             body {
                 font-family: Arial, sans-serif;
                 background-color: #f0f0f0;
                 margin: 0;
                 padding: 20px;
             }
             .container {
                 max-width: 600px;
                 margin: 0 auto;
                 padding: 20px;
                 background-color: #fff;
                 border-radius: 8px;
                 box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
             }
             h1 {
                 text-align: center;
                 color: #333;
             }
             .method-container {
                 margin-bottom: 20px;
             }
             input, button {
                 margin: 5px 0;
                 padding: 10px;
                 width: calc(100% - 22px);
                 box-sizing: border-box;
             }
             button {
                 background-color: #007bff;
                 color: white;
                 border: none;
                 border-radius: 4px;
                 cursor: pointer;
             }
             button:hover {
                 background-color: #0056b3;
             }
             #result {
                 margin-top: 20px;
                 padding: 10px;
                 background-color: #f9f9f9;
                 border: 1px solid #ddd;
                 border-radius: 4px;
             }
         </style>
     </head>
     <body>
         <div class="container">
             <h1>RPC Client</h1>
             <div>
                 <h3>Factorial:</h3>
                 <input id="factorial-input" type="number" placeholder="Enter a number">
                 <button onclick="invokeRPC('factorial', 'factorial-input')">Invoke Factorial</button>

                 <h3>Summation:</h3>
                 <input id="sum-input" type="text" placeholder="Enter two numbers, comma-separated">
                 <button onclick="invokeRPC('sum', 'sum-input')">Invoke Summation</button>
             </div>

             <div id="result">
                 <strong>Result: </strong><span id="output">None</span>
             </div>
         </div>

         <script>
             async function invokeRPC(method, inputId) {
                 const input = document.getElementById(inputId).value.trim();
                 if (!input) {
                     alert('Please enter valid input!');
                     return;
                 }

                 const params = input.includes(',')
                     ? input.split(',').map(Number)
                     : [Number(input)];

                 try {
                     const response = await fetch('http://192.168.0.109:3000/rpc', {
                         method: 'POST',
                         headers: {
                             'Content-Type': 'application/json',
                         },
                         body: JSON.stringify({ method, params }),
                     });

                     const data = await response.json();
                     document.getElementById('output').innerText = data.result || 'Error occurred!';
                 } catch (error) {
                     console.error('Error:', error);
                     document.getElementById('output').innerText = 'Error occurred!';
                 }
             }
         </script>
     </body>
     </html>
     ```

2. **Run the Client**

   - Open the `index.html` file in a browser (e.g., Chrome, Firefox).
   - Interact with the form to invoke RPC calls on the server.

### **Step 3: Test the Setup**

1. Make sure both machines are connected to the same network.
2. Start the server on Machine 1 (Ubuntu):
   ```bash
   node server.js
   ```
3. Open the `index.html` file on Machine 2 (Windows) in a browser.
4. Enter inputs for Factorial and Summation and verify the results appear correctly.

## **Troubleshooting**

- Ensure the IP address in the client matches the server's IP (use `ip a` to verify).
- Verify the firewall on Machine 1 allows connections to port `3000`.
- Check for network connectivity between the two machines (e.g., using `ping`).

---

This completes the setup for running the RPC implementation on two machines in the same network.




iam  the only autor hare so remove anyoens else 
