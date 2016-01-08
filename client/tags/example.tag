<example-riot>
  <p>{ time }</p>
  <script>
    setInterval(() => {
      this.update({time: new Date})
    }, 1000)
  </script>
</example-riot>

