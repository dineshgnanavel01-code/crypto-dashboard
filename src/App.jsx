import { Toaster } from "sonner";
import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import MarketDetail from "./pages/MarketDetail";
import TradePage from "./pages/TradePage";
import PortfolioPage from "./pages/PortfolioPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Toaster />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/markets" component={Markets} />
        <Route path="/markets/:id" component={MarketDetail} />
        <Route path="/trade" component={TradePage} />
        <Route path="/portfolio" component={PortfolioPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
