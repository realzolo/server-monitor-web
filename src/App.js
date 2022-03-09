import { useEffect, useState } from "react";
import Header from "./components/Header";
import List from "./components/List";
import Footer from "./components/Footer";

function App() {
  document.body.setAttribute("arco-theme", "dark");
  const [config, setConfig] = useState({});
  useEffect(() => {
    (async () => {
      let response, atLocal = false;
      try {
        // 请求服务器配置文件
        response = await fetch("/json");
      } catch (error) {
        // 请求本地配置文件
        response = await fetch("config.json");
        atLocal = true
      } finally {
        let ws;
        if (!atLocal) {
          const { url } = response;
          if (url.substring(0, 5) === "https") {
            ws = url.replace("https", "wss").replace("json", "wss/ws");
          } else {
            ws = url.replace("http", "ws").replace("json", "ws");
          }
        }
        const _config = await response.json();
        setConfig({
          site_title: _config.site_title,
          websocket_url: atLocal ? _config.websocket_url : ws,
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
