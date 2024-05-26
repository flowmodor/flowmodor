import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://3c175d84b8134a76d916034795fff9c8@o4507322643316736.ingest.us.sentry.io/4507322645348352',
  tracesSampleRate: 1,
  debug: false,
});
