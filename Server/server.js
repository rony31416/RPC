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

// Factorial function
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// Sum function
function sum(a, b) {
  return a + b;
}

// RPC route
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
