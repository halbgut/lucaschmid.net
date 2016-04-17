import styles from './styles.css'

import model from './model.js'
import intent from './intent.js'
import view from './view.js'

const main = (sources) =>
  ({ DOM:
    view(model(intent(sources.DOM)))
  })

export { intent, model, view, styles, main }

