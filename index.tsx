import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PlanningRoute from './components/PlanningRoute';
import { PLANNING_SLUG } from './planningConstants';

const isPlanningHash = (hash: string) =>
  hash === `#/${PLANNING_SLUG}` || hash === `#/${PLANNING_SLUG}/`;

const Root: React.FC = () => {
  const [route, setRoute] = useState<'public' | 'planning'>(() =>
    isPlanningHash(window.location.hash) ? 'planning' : 'public'
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(isPlanningHash(window.location.hash) ? 'planning' : 'public');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route === 'planning' ? <PlanningRoute /> : <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);