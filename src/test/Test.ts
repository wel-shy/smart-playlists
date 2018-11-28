import { describe } from 'mocha';

describe('api', () => {
  before(() => {
  });

  after(async () => {
  });

  /**
   * Import tests from files
   */
  require('./modules/media');
  require('./modules/home');
  require('./modules/auth');
  require('./modules/middleware');
  require('./modules/user');
  require('./modules/devices');
});
