import { useEffect, useState } from "react";
import Header from "./components/Header";
import List from "./components/List";

// CONFIG: {
//   SITE_NAME: ""
//   WEBSOCKET_URL: "",
// }
function App() {
  document.body.setAttribute('arco-theme', 'dark');
  const [config, setConfig] = useState({});
  useEffect(() => {
    (async () => {
      try {
        // 先从服务器加载
        const response = await fetch("http://127.0.0.1:10240/ws");
        const _config = await response.json();
        setConfig({
          SITE_NAME: _config.title || "SSProbe",
          WEBSOCKET_URL: "ws://127.0.0.1:" + _config.websocket_port
        })
      } catch (error) {
        // 从服务器加载配置文件失败,则从本地加载
        const response = await fetch("config.json");
        const _config = await response.json();
        setConfig({
          SITE_NAME: _config.SITE_TITLE || "SSProbe",
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
