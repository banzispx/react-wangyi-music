import React from "react";
import { renderRoutes } from "react-router-config";
// route 这里route的值就是上一个renderRoutes传过来的值
const Layout = ({ route }) => <>{renderRoutes(route.routes)}</>;

export default Layout;
