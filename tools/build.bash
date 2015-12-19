#!/bin/bash

# Kriegslustig <github@kriegslustig.me>
#yolo

ACTION=${1}
NODE_ENVIRONMENT=${NODE_ENVIRONMENT:-'PRODUCTION'}
PROJECT_ROOT=${PROJECT_ROOT:-./}

start_express () {
  local PORT=${1}
  node ${PROJECT_ROOT}src/server/main.js ${PORT} 2>&1
}

comp_browserify () {
  local FILE=${1}
  local DEBUG=''
  if [ -f "${FILE}" ]; then
    if [[ ${NODE_ENVIRONMENT} != 'PRODUCTION' ]]; then
      DEBUG="--debug"
    fi
    maybe_make_dir ${PROJECT_ROOT}build/_js
    browserify ${FILE} ${DEBUG} -t babelify > ${PROJECT_ROOT}build/_js/$(basename ${FILE})
  fi
}

js () {
  local FILE=${1}
  if [ -f "${FILE}" ]; then
    comp_browserify ${FILE}
  else
    for file in ${PROJECT_ROOT}src/client/js/*; do
      comp_browserify ${file}
    done
  fi
}

comp_riot () {
  local FILE=${1}
  local DEBUG=''
  maybe_make_dir build/_tag
  if [ -f "${FILE}" ]; then
    if [[ ${NODE_ENVIRONMENT} != 'PRODUCTION' ]]; then
      DEBUG="--debug"
    fi
    maybe_make_dir ${PROJECT_ROOT}build/_js
    NEW_DIR=$(make_dir ${PROJECT_ROOT}build/_tag/ ${FILE} ${PROJECT_ROOT}src/client/tag/)
    tools/compile_riot.js ${FILE} > ${NEW_DIR}$(change_ext $(basename ${FILE}) js 3)
  fi
}

riot () {
  local FILE=${1}
  if [ -f "./${FILE}" ]; then
    comp_riot ${FILE}
  else
    for file in $( find ${PROJECT_ROOT}src/client/tag/* -type f -name *.tag ); do
      comp_riot ${file}
    done
  fi
}

comp_postcss () {
  local FILE=${1}
  if [ -f "${FILE}" ]; then
    maybe_make_dir ${PROJECT_ROOT}build/_css
    postcss --local-plugins --config ${PROJECT_ROOT}tools/postcss.json --dir ${PROJECT_ROOT}build/_css ${FILE}
  fi
}

css () {
  local FILE=${1}
  if [ -f "./${FILE}" ]; then
    comp_postcss ${FILE}
  else
    for file in ${PROJECT_ROOT}src/client/css/*; do
      comp_postcss ${file}
    done
  fi
}

comp_handlebars () {
  local FILE=${1}
  maybe_make_dir ${PROJECT_ROOT}build/_html
  if [ -f "${FILE}" ]; then
    OUT="$(cd ${PROJECT_ROOT}src/client/handlebars && node ../../../${FILE})"
    if (( ${#OUT} > 1 )); then
      NEW_DIR=$(make_dir ${PROJECT_ROOT}build/_html/ ${FILE} ${PROJECT_ROOT}src/client/handlebars/)
      echo "${OUT}" > ${NEW_DIR}$(change_ext $(basename ${FILE}) html 2)
    fi
  fi
}

handlebars () {
  local FILE=${1}
  if [ -f "./${FILE}" ]; then
    comp_handlebars ${FILE}
  else
    for file in $( find ${PROJECT_ROOT}src/client/handlebars/* -type f -name *.js ); do
      comp_handlebars ${file}
    done
  fi
}


build () {
  js
  css
  riot
  handlebars
}

maybe_make_dir () {
  local DIR=${1}
  if [ ! -d "${DIR}" ]; then
    mkdir -p ${DIR}
  fi
}

make_dir () {
  local TARGET_DIR=${1}
  local FILE=${2}
  local BASE_DIR=${3}
  local NEW_DIR=$(dirname ${TARGET_DIR}${FILE:${#BASE_DIR}})/
  maybe_make_dir ${NEW_DIR}
  echo ${NEW_DIR}
}

change_ext () {
  local FILE=${1}
  local EXT=${2}
  local OLD_EXT_LENGTH=${3}
  echo ${FILE:0:$(( ${#FILE} - ${OLD_EXT_LENGTH} ))}${EXT}
}

browserify () {
 ${PROJECT_ROOT}node_modules/browserify/bin/cmd.js ${*}
}

if [[ ${ACTION} == 'js' ]]; then
  js ${2}
  echo "JS compiled"
elif [[ ${ACTION} == 'css' ]]; then
  css ${2}
  echo "CSS compiled"
elif [[ ${ACTION} == 'riot' ]]; then
  riot ${2}
  echo "Riot-tags compiled"
elif [[ ${ACTION} == 'start' ]]; then
  start_express ${2}
elif [[ ${ACTION} == 'handlebars' ]]; then
  handlebars ${2}
  echo "Handlebar templates compiled"
else
  build
fi

