import NotFound from "../components/NotFound";
import ScoreBoard from "../components/ScoreBoard";
import StepperContainer from "../components/StepperContainer";
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

const Main: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={StepperContainer} />
        <Route exact path="/score" component={ScoreBoard} />
        <Route path="*" component={NotFound} />
      </Switch>
    </HashRouter>
  );
};

export default Main;
