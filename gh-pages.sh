#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PAGE_DIR="/docs"
ASSET_DIR="/dist"

read -r -d '' INDEX <<- EOM
<!DOCTYPE html>
<html lang="es" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>hjg2pdf</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton-framework/1.1.1/skeleton.min.css">
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="container">
      <div class="center-text heading row">
        <div class="column">
          <h1>Léon-Dufour a PDF</h1>
          <h5 class="subtitle">Descarge la palabra y sus lecturas en pdf.</h5>
        </div>
      </div>
    </div>
    <form>
      <div class="row">
        <div class="column four"></div>
        <div class="column four">
          <input class="input u-full-width" type="text" placeholder="Ingrese su Palabra" id="palabra">
          <button class="u-full-width button-primary" type="button" name="button" id="buscar" onclick="">Buscar</button>
        </div>
      </div>
    </form>
    <div class="row">
      <div class="column">
        <p id="mensaje"></p>
      </div>
    </div>
    <script src="hjg2pdf.js"></script>
    <script>
      console.warn('hjg2pdf is loading...');
      hjg2pdf.load({
        threadWorkers: 4
      }).then(function() {
        console.log('Finished loading hjg2pdf!');
        hjg2pdf.runFileAsync('hjg2pdf.py', {
          cwd: '/files',
          env: {},
          args: ['agua']
        });
      });
    </script>
  </body>
</html>
EOM

read -r -d '' STYLE <<- EOM
.center-text {
  text-align: center;
}

.heading {
  margin-top: 5rem;
  margin-bottom: 3rem;
}

.input {
  height: 3rem;
}

.subtitle {
  margin-top: -2rem;
}
EOM

(
  cd $DIR;
  if [ -d "${DIR}${PAGE_DIR}" ]
  then
    rm -rf "${DIR}${PAGE_DIR}"
  fi

  cp -r "${DIR}${ASSET_DIR}" "${DIR}${PAGE_DIR}"
  chown mageia:mageia "${DIR}${PAGE_DIR}"
  chmod -R 775 "${DIR}${PAGE_DIR}"
  echo $INDEX > "${DIR}${PAGE_DIR}/index.html"
  touch "${DIR}${PAGE_DIR}/style.css"
  echo $STYLE > "${DIR}${PAGE_DIR}/style.css"
)
