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
        // 请求本地配置文件
        response = await fetch("config.json");
        atLocal = true;
      } catch (error) {
        // 请求服务器配置文件
        response = await fetch("http://127.0.0.1:10240/ws");
      } finally {
        const _config = await response.json();
        setConfig({
          site_title: _config.site_title,
          websocket_url: atLocal ? _config.websocket_url : "ws://127.0.0.1:" + _config.websocket_port,
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
