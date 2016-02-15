# My experience working with Durpal (a rant)

[ctime:1455563400866]

I don't like Drupal not 7 and not 8. I just don't like it. Here's why. **Disclaimer**: _May contain inapropriate language_.

## TL;DR;

Drupals documentation sucks. It's inconsistent, incomplete, unsearchable and horribly structured. The coding style guide is total over kill. If you have such strong guide-lines, why not have the same thing for docs? Patches for issues lie around for years without beeing taken in.

## Core Documentation

[Drupals core docs](https://api.drupal.org/api/drupal/7) are aweful. Its UI is pitiful. You never know what version of the docs you are browsing. That thing on the right hand side, WTF!? That suposed to be a navigation of some sort. Then why can't I see where I am in the tree when browsing some lower level page. The URL schema is inconsistand and hard to grasp. Here are some examples:

```
https://api.drupal.org/api/drupal/7/search/xyz
https://api.drupal.org/api/drupal/modules!system!system.tar.inc/function/Archive_Tar%3A%3A_close/7
```

Could someone please expain why the hell the `/7` would be at the end for some pages and in front for others. Having it at the end is a stupid idea in the first place, but beeing inconsistent about it... that's a whole other league of idiocy. I'm not a violant person, but someone should be beaten for this.

The **search feature** on the page is probably the worst and most counter prodcutive thing on the whole page. For one thing the GUI is bad, the autocomplete feature is slow and when you press enter to search without autocompleting your term you only cancel the autocomplete and then have to press it again to search. Leaving aside the fact that the results page is badly structured, my next big issue with the search feature is the search functionality itself. For example, when searching for _tar_ you'll get `stark.inc`. I get it `tar` is in `start`, but seriously, it's not that hard to weigh in word boundaries when indexing. Also it doesn't even properly count occurences of a string in a document. It doesn't even properly prioritize occurences in things like document titles. It's simply horribly implemented and incredibly frustrating to work with. Search on the scale of the Drupal docs is a well researched area. There are good solutions for it. So why the hell do they make it seem so damn hard.

## Documentation Of Contrib Modules

Another big Problem is contrib module documentation. In my experience it's consistently poor. Again the URL scheme leaves a lot to be desired here. The documents lack consitency. Dupal has rediciolously strict coding style standards, so why is the only thing consitent about contrib module's documentation, their incompletness. PHP people like to make fun of _poor coding style_ seen in JS. But seriously I have never seen an NPM module half as populare as the Drupal [devel module](https://www.drupal.org/project/devel) with such bad documentation.

In all seriousness how can anyone live with such horrible documentation. For example, the [flag](https://www.drupal.org/documentation/modules/flag) module.

Also the UI is horrible. Fist of all, why the fuck aren't the docs for a project hirachically underneith the project itsef? So the docs are sperate from the projects themselfs, ok I could get over that. But only if the wasn't structured by a fifth grader! Seriously! How could anyone think hiding the docs for the flag module under _Organizing content with taxonomies_ > _Contributed modules for taxonomy and tagging_ > _Flag: Custom flags for nodes, users, comments, and more_ would be a good idea. Also not helpful; the navigation. **Structure Guide** what kind of title is that!?

## Coding Style

The Coding style the Drupal projects impose on contrib module authors is just short of oppression of free speech. It seems to me that the people that wrote these documents worry more about coding style than actual code quallity and performance. This raises the question; why are they so strict about coding style and not about documentation. That's stupid. Having a comment `Implements hook_your_mum` could easily be made redundant by a semi-intelligent documentation parser. People should rather leave that redundant comment away and write a sentence about what the hell their actually doing with the damn thing!

## Maintainance

The Drupal core has thousands of open issues in every version. No one is able to keep track of them. Bug fixes for core issues often lie around for **years** in the state **needs further testing**. How could anyone think that that's ok.

## Caching

The caching system is so complex that it often simply doesn't work. It's not uncommon, for sites to run faster without caching than with caching turned on.

## Scale

Drupal doesn't scale well.

## _The Drupal Way_

What the fuck is going on with Drupal people and GUIs!? Has the thought ever come to you that, if someone can't use a command line and a text editor, they might not be quallified to mess around with complicated systems?

## _Not Invented Here_

The Drupal Core has a serious _Not Invented Here_ problem. It might have gotten better in D8.

