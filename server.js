import express from "express";
import { createServer } from "node:http";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { join } from "node:path";
import { hostname } from "node:os";
import fs from "fs/promises";

const __dirname = process.cwd();
const app = express();

const publicdir = join(__dirname, "static");
app.use(express.static(publicdir));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));
app.use(express.json());




app.get("/", (req, res) => {
    res.sendFile(join(publicdir, "index.html"));
});

app.use((req, res) => {
    res.status(404).sendFile(join(publicdir, "404.html"));
});

const server = createServer(app);


let port = parseInt(process.env.PORT || "8080");
if (isNaN(port)) port = 8080;

server.listen(port, () => {
    console.log("Spectra Running!");
    console.log(`Listening on http://localhost:${port}`);
    console.log(`Listening on http://${hostname()}:${port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("goodbye!");
    server.close();
    process.exit(0);
}