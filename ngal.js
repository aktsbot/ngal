#!/usr/bin/env node

const ngalServer = require("./server");
const PORT = process.argv[2] || 3030;

ngalServer.listen(parseInt(PORT), () => {
  console.log(`[server] listening on PORT ${PORT}`);
});
