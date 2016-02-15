# My experience working with Durpal (a rant)

[ctime:1455563400866]

I don't like Drupal not 7 and not 8. I just don't like it. Here's why:

## Documentation

[Drupals core docs](https://api.drupal.org/api/drupal/7) are aweful. Its UI is pitiful. You never know what version of the docs you are browsing. That thing on the right hand side, WTF!? That suposed to be a navigation of some sort. Then why can't I see where I am in the tree when browsing some lower level page. The URL schema is inconsistand and hard to grasp. Here are some examples:

```
https://api.drupal.org/api/drupal/7/search/xyz
https://api.drupal.org/api/drupal/modules!system!system.tar.inc/function/Archive_Tar%3A%3A_close/7
```

Could someone please expain why the hell the `/7` would be at the end for some pages and in front for others. Having it at the end is a stupid idea in the first place, but beeing inconsistent about it... that's a whole other league of idiocy. I'm not a violant person, but someone should be beaten for this.

The **search feature** on the page is probably the worst and most counter prodcutive thing on the whole page. For one thing the GUI is bad, the autocomplete feature is slow and when you press enter to search without autocompleting your term you only cancel the autocomplete and then have to press it again to search. Leaving aside the fact that the results page is badly structured, my next big issue with the search feature is the search functionality itself. For example, when searching for _tar_ you'll get `stark.inc`. I get it `tar` is in `start`, but seriously, it's not that hard to weigh in word boundaries when indexing. Also it doesn't even properly count occurences of a string in a document. It doesn't even properly prioritize occurences in things like document titles. It's simply horribly implemented and incredibly frustrating to work with.

## Maintainance

## Caching

## Scale

## _The Drupal Way_

