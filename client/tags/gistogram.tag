<gistogram>
  <p>I like code.</p>
  <div class="chart__item" each={day in days}>
    <div class="chart__number">{day.length}</div>
    <div class="chart__commits" each={day}>
      <a href={url} class="chart__commit">{comment}</a>
    </div>
  </div>
  <style scoped>
    :scope {
      display: block;
      padding: 1rem;
      float: left;
      width: 100%;
      height: 100vh;
      background-color: hsl(240, 30%, 90%);
    }

    :scope .chart {
      width: 100%;
    }

    :scope .chart__item {
      display: inline-block;
      position: relative;
      height: calc(100% - 3rem);
      width: 2rem;
      margin: 3rem .8rem 0 .8rem;
      background-color: #fff;
      transform: //scaleY(0);
      transition: transform .4s;
    }

    :scope .chart__number {
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

    :scope .chart__item:hover .chart__number {
      transform: scaleY(1) translateY(0);
    }

    :scope .chart__number:after {
      content: '';
      position: absolute;
      bottom: -.5rem;
      left: .5rem;
      height: 1rem;
      width: 1rem;
      background-color: #EEE;
      transform: rotate(45deg);
    }

    :scope .chart__commits {
      position: absolute;
      opacity: 0;
    }
  </style>
  <script>
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
  </script>
</gistogram>

