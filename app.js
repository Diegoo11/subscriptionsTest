import { startStandaloneServer } from '@apollo/server/standalone';

import server from './apolloConfig.js';

const { url } = await startStandaloneServer(server, { listen: 5000 });

console.log(url);
