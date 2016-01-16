<gistogram>
  <p>I like code.</p>
  <div class="container">
    <div class="item__container" each={day in days}>
      <div class="item">
        <div class="number">{day.length}</div>
        <div class="commits" each={day}>
          <a href={url} class="commit">{comment}</a>
        </div>
      </div>
    </div>
  </div>
  <yield/>
  <style scoped>
    :scope {
      display: block;
      width: 100%;
      height: 100vh;
      background-color: hsl(240, 30%, 90%);
    }

    :scope > p {
      padding: 1rem;
    }

    :scope .container {
      padding: 1rem;
      direction: rtl;
      height: calc(100vh - 5.6rem);
      white-space: nowrap;
    }

    :scope .item {
      display: block;
      position: absolute;
      height: 0;
      width: 100%;
      left: 0;
      bottom: 0;
      background-color: #fff;
      transition: height .4s;
    }

    :scope .item__container {
      display: inline-block;
      position: relative;
      width: 2rem;
      height: 100%;
      margin: 0 .8rem;
    }

    :scope .number {
      position: absolute;
      top: -3rem;
      right: 0;
      height: 2rem;
      width: 2rem;
      line-height: 2rem;
      text-align: center;
      border: none;
      border-radius: .25rem;
      color: #000;
      background-color: #EEE;
      transform: scaleY(0) translateY(7rem);
      transition: transform .2s;
    }

    :scope .item:hover .number {
      transform: scaleY(1) translateY(0);
    }

    :scope .number:after {
      content: '';
      position: absolute;
      bottom: -.5rem;
      left: .5rem;
      height: 1rem;
      width: 1rem;
      background-color: #EEE;
      transform: rotate(45deg);
    }

    :scope .commits {
      position: absolute;
      opacity: 0;
    }
  </style>
  <script>
    const _ = require('lodash')

    this.days = [
      [
        {
          comment: 'Hi!',
          url: '/'
        },
        {
          comment: 'bye!',
          url: '/'
        },
      ],
      [
        {
          comment: 'Hi!',
          url: '/'
        },
        {
          comment: 'bye!',
          url: '/'
        },
        {
          comment: 'yoo!',
          url: '/'
        }
      ]
    ]

    const updateHeights = () => {
      if(!this.root.children[1]) return
      const highest = _.map(this.days, day => day.length)
        .sort()
        .reverse()[0]
      _.chain(this.root.children[1].querySelectorAll('.item'))
        .map((item, i) => {
          const height = Math.round(this.days[i].length / highest * 100)
          item.style.height = `${height}%`
        })
        .value()
    }

    this.on('mount', () => {
      setTimeout(updateHeights, 0)
    })

    this.on('updated', updateHeights)

  </script>
</gistogram>

