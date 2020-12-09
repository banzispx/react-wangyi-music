import React from "react";
// store的使用
import { Provider } from "react-redux";
import store from "./store/index";
// 路由
import { renderRoutes } from "react-router-config";
import routes from "./routes/index.js";
import { HashRouter } from "react-router-dom";
// 映入iconFont图标 和全局重置style
import { IconStyle } from "./assets/iconfont/iconfont";
import { GlobalStyle } from "./style";
import "./fix.css";

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        {renderRoutes(routes)}
      </HashRouter>
    </Provider>
  );
}

export default App;
