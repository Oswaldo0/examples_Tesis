const url = process.argv[2];

if (!url) {
  console.error('URL requerida');
  process.exit(2);
}

try {
  const response = await fetch(url);
  const body = await response.text();
  console.log(`STATUS:${response.status}`);
  console.log(body);
} catch (error) {
  console.error(`ERROR:${error.message}`);
  process.exit(1);
}
