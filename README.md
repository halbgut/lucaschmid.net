# glue-stack

A simplistic node-based web-stack not compromising fancy frontend tech for speed

The glue-stack is a static-site-generator-ish framework meant to be versatile and scale well.

The served HTML is generated from Handlebars templates (by default). All the dynamic content is rendered using Riot and pulled from the Server using XHR or WebSockets or what ever suits your project best. It should be easily possible to server the HTML-Files using an Nginx-Server and only server request to `/_api` through Express.

```bash
tools/
    build.bash # The Bash-script responsible for building things
    compile_riot.js # A short little node script compiling riot-tags
    postcss.json # The config-file for postcss (it just includes some plugins)
    watch.js # The actual file-watcher. It triggers the build script
src/ # Contains all the source code
    server/ # All Server-side code
        main.js # This is run when as `npm start`
    client/ # All client side code
        tag/ # Riot-tags these are compiled to js (src/client/tag/path/x.tag -> build/_tag/path/x.js)
        css/ # CSS
        js/ # Client side js
        handlebars/ # Handlebars templates
          example.js # Executed by the build task. If it writes something to stdout it will be saved to build/_html/example.html
          example.handlebars # This may be required by example.js
build/ # Contains all built code that can be requested as static files
    _js/
    _tag/
    _css/
    _html/
```

## Who this is not for

This Framework is for people who want to understand the technology on a low level. It's for people who want to work with standard and future-proof systems (or at least as standard and future proof as it gets in a node.js environment).

## Why?

* Simplicity - The whole System is very easy to grasp.
* Flexibility - Since every Project has it's own build-scripts, things can easily be changed.

# Usage

To start the watcher and the Express server

```
npm run watch
```

To start the Express server

```
npm start
```

Build commands
```
# Build everything
tools/build.bash

# Build CSS
tools/build.bash css

# Build Handlebars
tools/build.bash handlebars

# Build Riot-tags
tools/build.bash riot

# Build JS
tools/build.bash js
```

