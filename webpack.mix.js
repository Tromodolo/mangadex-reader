const mix = require("laravel-mix");

mix.setPublicPath("public");

mix
  .ts("resources/assets/ts/app.ts", "js/app.js")
  .postCss(
    "resources/assets/css/app.css",
    "css",
    [require("tailwindcss")]
  );
