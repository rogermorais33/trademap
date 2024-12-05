import RoutesApp from './routes';
import { createLogger } from './utils/logger';

const logger = createLogger({ context: 'App' });

export default function App() {
  logger.info('App has loaded successfully');

  return (
    <div className="app">
      <RoutesApp />
    </div>
  );
}
