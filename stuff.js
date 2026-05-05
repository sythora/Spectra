import { BareMuxConnection } from "/baremux.mjs";
const { ScramjetController } = window.$scramjetLoadController();

const scramjet = new ScramjetController({
  files: {
    wasm: "/scram/scramjet.wasm.wasm",
    all: "/scram/scramjet.all.js",
    sync: "/scram/scramjet.sync.js",
  },
});

// scramjet init
try {
  if (navigator.serviceWorker) {
    scramjet.init();
    navigator.serviceWorker.register("./sw.js");
  }
} catch (e) {
  console.error("scramjet died:", e);
}

// BareMux
const connection = new BareMuxConnection("/worker.js");

const wispUrl = "wss://truffled.lol/wisp/";

async function setTransport(type) {
  const transport =
    type === "libcurl"
      ? ["libcurl.mjs", [{ websocket: wispUrl }]]
      : ["/epoxy.mjs", [{ wisp: wispUrl }]];

  await connection.setTransport(...transport);
}

// URL resolver
function search(input) {
  const template = "https://www.google.com/search?q=%s";

  try {
    return new URL(input).toString();
  } catch {}

  try {
    const url = new URL("http://" + input);
    if (url.hostname.includes(".")) return url.toString();
  } catch {}

  return template.replace("%s", encodeURIComponent(input));
}

// default transport
setTransport("epoxy");

// elements
const form = document.getElementById("idk");
const iframe = document.getElementById("iframe");
const input = document.getElementById("url");
const placeholder = document.getElementById("placeholder");

// submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fixedurl = search(input.value);
  const mode = document.getElementById("proxysel").value;

  let url;

  if (mode === "uv") {
    url = __uv$config.prefix + __uv$config.encodeUrl(fixedurl);
  } else {
    url = scramjet.encodeUrl(fixedurl);
  }

  placeholder.style.display = "none";
  iframe.style.display = "block";

  iframe.src = url;

  
});

input.focus();