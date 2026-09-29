#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { runHttpServer } from "./http-transport.js";
import { createServer } from "./server.js";

type TransportMode = "stdio" | "http";

function getTransportMode(): TransportMode {
  const mode = process.env.MCP_TRANSPORT?.toLowerCase();
  if (mode === "http") {
    return "http";
  }
  return "stdio";
}

async function runStdioServer() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

async function main() {
  const mode = getTransportMode();

  if (mode === "http") {
    const server = createServer();
    const host = process.env.MCP_HOST || "127.0.0.1";
    const port = parseInt(process.env.MCP_PORT || "3000", 10);
    const path = process.env.MCP_PATH || "/mcp";

    if (Number.isNaN(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid MCP_PORT: ${process.env.MCP_PORT}`);
    }

    await runHttpServer(server, { host, port, path });
    return;
  }

  await runStdioServer();
}

main().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
