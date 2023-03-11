import { StaticRouter } from "react-router-dom/server";
import App from "./src/App";

export default function Entery(url) {
  return (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
