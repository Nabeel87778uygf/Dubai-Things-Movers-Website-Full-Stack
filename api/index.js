import server from "../dist/server/server.js";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  return await server.fetch(req);
}
