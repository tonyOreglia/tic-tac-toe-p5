# To Do

-   [x] learn how to use p5 / run it locally and see changes in browser

I just downloaded the p5 complete [here](https://p5js.org/download/) and serve it using browsersync:

```
$ npm i -g browser-sync
$ browser-sync start --server -f -w
```

-   [x] implement visual interface using p5[https://p5js.org/get-started/] by following the p5 guide and build from scratch
-   [ ] format for github pages
-   [ ] add the github page to my

## Things I need to learn

### I should just ask [Adrien](https://github.com/statox), ok here is what I asked him about:

-   Do you write the index.html file from scratch?
-   I notice you don't have a gh-pages branch -- how is it published in this case?
-   Did Adrien use some framework to generate the index.js file?

### What I learned from Adrien (thank you)

-   Adrien has a [code pen](https://codepen.io/statox/pen/vYGNXJX) where everything is ready all you have to do is start modifying the JS file, that's great to quickly start a project before making a full application:
-   This guy https://www.youtube.com/user/shiffman is a great contributor of processing (precurser to p5), especially his coding challenges, and particularly [this video](https://www.youtube.com/watch?v=17WoOqgXsRM&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH)
-   Yes Adrien writes the index.html from scratch but really he start with just a sketch and then when it's getting bigger starts adding more html. But for simple projects you don't need more that just the canvas.
-   When you'll want a more complete UI I also have a boiler plate with p5js + vuejs, [here](https://github.com/statox/p5-vue-boilerplate). It allows passing of data between the UI and the sketch which allow bigger applications.
-   With github pages, you can directly deploy the master branch (cf. ![screenshot](github-pages-settings.png 'github pages'))
-   About the html and to show you that you can create complete stuff without touching it too much: See example [here](https://github.com/statox/asteroides/blob/master/index.html)

## Resources
