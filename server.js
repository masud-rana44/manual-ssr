const { readFileSync } = require("fs");
const { createServer } = require("http");
const { parse } = require("url");
const React = require("react");
const { renderToString } = require("react-dom/server");

const pizzas = [
  {
    name: "Focaccia",
    price: 6,
  },
  {
    name: "Pizza Margherita",
    price: 10,
  },
  {
    name: "Pizza Spinaci",
    price: 12,
  },
  {
    name: "Pizza Funghi",
    price: 12,
  },
  {
    name: "Pizza Prosciutto",
    price: 15,
  },
];

function Home() {
  return (
    <div>
      <h1>🍕 Fast React Pizza Co.</h1>
      <p>This page has been rendered with React on the server 🤯</p>

      <h2>Menu</h2>
      <ul>
        {pizzas.map((pizza) => (
          <MenuItem pizza={pizza} key={pizza.name} />
        ))}
      </ul>
    </div>
  );
}

function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <span>{count}</span>
    </div>
  );
}

function MenuItem({ pizza }) {
  return (
    <li>
      <h4>
        {pizza.name} (${pizza.price})
      </h4>
      <Counter />
    </li>
  );
}

const htmlTemplate = readFileSync(`${__dirname}/index.html`, "utf8");
const reactTemplate = renderToString(<Home />);
const clientJs = readFileSync(`${__dirname}/client.js`, "utf8");
const html = htmlTemplate.replace("%%%CONTENT%%%", reactTemplate);

const server = createServer((req, res) => {
  const pathname = parse(req.url, true).pathname;

  if (pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(html);
  } else if (pathname === "/client.js") {
    res.writeHead(200, { "Content-type": "text/javascript" });
    res.end(clientJs);
  } else if (pathname === "/test") {
    res.end("Test");
  } else {
    res.end("Page not found");
  }
});

server.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});
