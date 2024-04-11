const express = require('express');
const app = express();

app.use(express.json());

let messageCount = 0;

const messageLimitMiddleware = (req, res, next) => {
  console.log('Message count:', messageCount);
  
  if (messageCount >= 5) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }
  
  messageCount++;
  next();
};

app.post('/messages', messageLimitMiddleware, (req, res) => {
  console.log('Received message:', req.body.text);

  if (!req.body.text || req.body.text.trim() === '') {
    return res.status(400).json({ error: 'Bad Request' });
  }
  
  res.json({ message: 'Message received loud and clear' });
});

app.use((req, res, next) => {
  if (messageCount >= 5) {
    messageCount = 0;
  }
  next();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});