import { polyfill } from 'es6-promise';

import { Application } from './Application';

polyfill();
let app: Application = new Application();
app.exec();
