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
    if (result && !result.success) {
      throw new Error()
    }
    return [response, result, result.success]
  }
  useEffect(() => {
    (async () => {
      let toSResArray, toLResArray, wsUrl;
      try {
        toSResArray = await fetchData("/json");
      } catch (e) {
        toLResArray = await fetchData("config.json")
      } finally {
        if (toSResArray[2]) {
          const { url } = toSResArray[0];
          if (url.substring(0, 5) === "https") {
            wsUrl = url.replace("https", "wss").replace("json", "wss/ws");
          } else {
            wsUrl = url.replace("http", "ws").replace("json", "ws");
          }
        }
        const _config = toSResArray[2] ? toSResArray[1] : toLResArray[1];
        setConfig({
          site_title: _config.site_title,
          websocket_url: atServer ? wsUrl : _config.websocket_url,
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
