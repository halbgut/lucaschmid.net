# [Altboiler](https://github.com/Kriegslustig/meteor-altboiler)

Altboiler is an alternative Boilerplate for the [Meteor](https://www.meteor.com/) platform. I made the package in reaction to a StackOverflow question titled [_"Meteor: Eliminate render-blocking JavaScript and CSS in above-the-fold content"_](http://stackoverflow.com/questions/28886432/meteor-eliminate-render-blocking-javascript-and-css-in-above-the-fold-content). I read big parts of the Meteor-core in the Process. Especially the boilerplating parts, to figure out how I could replace the standard boilerplate with something that would perform better.

It was a very interesting exprerience and my first time diving this deep into a OSS frameworks source code.

I basically ended up implementing server-side rendering for Blaze. So the Package lets you serve static HTML with some undynamic content and load the Meteor core at the bottom of the page. I got the following results from a Google-Pagespeed test on the [example-page](http://altboiler.meteor.com/):

![A Google-Pagespeed test without altboiler](/_img/pagespeed_without.png)
![A Google-Pagespeed test with altboiler activated](/_img/pagespeed_with.png)

So the advantages are pretty clear. Better load times, better searchengine ratings and best of all, a way to provide a gracefull fallback for no-script browsers.

Today the package has a total of 29 installs and 21 Github-Stars. I think there are many reason why the package was so unpoular. The biggest reason was, that I didn't care enough wether anyone would use it or not. Also I realeased 1.0 around the time of the rise of React with its server-side rendering capabilities in the Meteor community.

Anyway, I have moved on. Right now I'm only semi-acively working on one Meteor Project ([Redact](https://github.com/Kriegslustig/redact-core)). My main reasons for leaving the Meteor platform are scalability and performance.

