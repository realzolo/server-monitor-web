import { useEffect, useState } from "react";
import Header from "./components/Header";
import List from "./components/List";

let CONFIG = {
  API: "",
  SITE_NAME: ""
}
function App() {
  document.body.setAttribute('arco-theme', 'dark');
  const [config, setConfig] = useState({});
  useEffect(() => {
    (async () => {
      const response = await fetch("config.json");
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
