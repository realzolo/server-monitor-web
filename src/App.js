import { useEffect, useState } from "react";
import Header from "./components/Header";
import List from "./components/List";

let CONFIG = {
  WEBSOCKET_URL: "",
  SITE_NAME: ""
}
function App() {
  document.body.setAttribute('arco-theme', 'dark');
  const [config, setConfig] = useState({});
  useEffect(() => {
    (async () => {
      const response = await fetch("static/config.json");
      CONFIG = await response.json();
      setConfig(CONFIG)
    })()
  }, [])

  return (
    <>
      <Header config={config} />
      <List config={config} />
    </>
  );
}

export default App;
