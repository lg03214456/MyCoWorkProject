// src/utils/config.js

export async function loadConfig() {
  const response = await fetch('/config.json');
  const json = await response.json();

  const env = json.ENV;
  const config = json[env];

  return {
    ENV: env,
    BASE_URL: config.BASE_URL,
  };
}
