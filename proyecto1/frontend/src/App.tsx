// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BarraSuperior from './BarraSuperior';
import Live from './Live'; // Cambio de Inicio a Live
import History from './History'; // Cambio de Pagina1 a History
import PidTree from './PidTree'; // Cambio de Pagina2 a PidTree

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <BarraSuperior />
        <Switch>
          <Route exact path="/" component={Live} /> {/* Cambio de Ruta y Componente */}
          <Route path="/history" component={History} /> {/* Cambio de Ruta y Componente */}
          <Route path="/pidtree" component={PidTree} /> {/* Cambio de Ruta y Componente */}
        </Switch>
      </div>
    </Router>
  );
};

export default App;
