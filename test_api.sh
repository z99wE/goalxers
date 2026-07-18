node server/index.js &
SERVER_PID=$!
sleep 2
curl -X POST http://localhost:3000/api/groq/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"hello"}]}'
echo ""
kill $SERVER_PID
