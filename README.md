# w7d1_assignment

Express.js Rate-Limited Message API

This is a simple Express.js API that allows users to send messages with a built-in rate limiter. The server restricts the number of messages that can be sent to 5 requests per user before returning a "Too Many Requests" error.


Simple Express.js server.
Rate-limiting middleware that restricts users to 5 messages.
Automatic reset of message count either after hitting the limit or after a set time period.
JSON-based API.