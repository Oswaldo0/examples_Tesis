import { app } from './src/app.js';

const port = process.env.PORT || 3010;

app.listen(port, () => {
  console.log(`APP_ONLY listening on ${port}`);
});
