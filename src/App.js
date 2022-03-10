import { useEffect, useState } from "react";
import Header from "./components/Header";
import List from "./components/List";
import Footer from "./components/Footer";

function App() {
  document.body.setAttribute("arco-theme", "dark");
  const [config, setConfig] = useState({});
  async function fetchData(url) {
    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) {
      throw new Error()
    }
    return [response, result, response.ok]
  }
  useEffect(() => {
    (async () => {
      let toSResArray, toLResArray, wsUrl;
      try {
        toSResArray = await fetchData("/json");
      } catch (e) {
        toLResArray = await fetchData("config.json")
      } finally {
        const atServer = toSResArray && toSResArray[1] && toSResArray[2];
        if (atServer) {
          const { url } = toSResArray[0];
          if (url.substring(0, 5) === "https") {
            wsUrl = url.replace("https", "wss").replace("json", "wss/ws");
          } else {
            wsUrl = url.replace("http", "ws").replace("json", "ws");
          }
        }
        const _config = (atServer) ? toSResArray[1] : toLResArray[1];
        setConfig({
          site_title: _config.site_title,
          websocket_url: (atServer) ? wsUrl : _config.websocket_url,
          github: _config.github,
          telegram: _config.telegram
        })
      }
    })()
  }, [])
  return (
    <div className="app_wrapper">
      <div className="app_box">
        <Header config={config} />
        <List config={config} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
