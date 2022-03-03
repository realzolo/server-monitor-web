import { useEffect, useState } from "react";
import Header from "./components/Header";
import List from "./components/List";

function App() {
  document.body.setAttribute('arco-theme', 'dark');
  const [config, setConfig] = useState({});
  useEffect(() => {
    (async () => {
      try {
        // 拉取本地服务器配置文件
        const response = await fetch("localhost:10240/ws");
        const _config = await response.json();
        setConfig({
          SITE_TITLE: _config.title || "SSProbe",
          WEBSOCKET_URL: "ws://127.0.0.1:" + _config.websocket_port
        })
      } catch (error) {
        // 拉取本地配置文件
        const response = await fetch("config.json");
        const _config = await response.json();
        setConfig({
          SITE_TITLE: _config.SITE_TITLE || "SSProbe",
          WEBSOCKET_URL: _config.WEBSOCKET_URL
        })
      }
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
