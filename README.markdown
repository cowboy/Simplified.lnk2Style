# Simplified: a Linkinus Style #
<http://benalman.com/projects/simplified-style/>

Version: 2.2.2pre

* Minimum app version required: Linkinus 2.2
* Embedded media support (not) coming soon!

Simplified is a WebKit message style for the popular OS X [Linkinus](http://conceitedsoftware.com/products/linkinus) IRC application. While developed independently of the Linkinus app, great effort was spent working with the app development team to not only tailor Simplified to it, but to also enhance the app style API for Simplified and other message styles. As a result, the Simplified source is modular and well-organized, and style authors are encouraged to use Simplified as a framework for building their own styles.

Simplified is included with Linkinus 2.0.2 and newer, but updates will made available here first as the style is updated.

Visit the [project page](http://benalman.com/projects/simplified-style/) for more information, including a features list and screenshots!

If you like this theme, [please consider donating](http://benalman.com/donate)!

## Installation ##

There are two basic ways to install the latest version of Simplified:

### Non-hacker version ###

 1. Click the big "Download" button at the top of the page.
 2. Click the "Download .zip" button.
 3. Unzip the `cowboy-Simplified.lnk2Style-wholebunchofstuff.zip` file and rename the resulting folder to `Simplified.lnk2Style`.
 4. Double-click the `Simplified.lnk2Style` bundle to install it into Linkinus.
 5. At this point, you might need to restart Linkinus to see the new changes.

### Hacker version ###

If you have [git](http://code.google.com/p/git-osx-installer/) installed, you can run these commands in the terminal, then restart Linkinus to see the changes.
 
    cd ~/Library/Application\ Support/Linkinus\ 2/Styles
    mv Simplified.lnk2Style Simplified.lnk2Style~
    git clone git://github.com/cowboy/Simplified.lnk2Style.git


## Contributing ##

If you want your variant to be included in the official release of Simplified, please fork this repo, add your variant (and modify Variants.plist), and issue a pull request. If your new variant is awesome, it will be included!

_Note: If your new variant modifies any existing files (style.css, for example), your pull request will be ignored--unless you have a really good reason and can show that none of the existing variants are affected._


## License ##
Copyright (c) 2011 "Cowboy" Ben Alman  
Licensed under the MIT license  
<http://benalman.com/about/license/>


## Release History ##

2.2.1 - (3/5/2011) Reorganized project, added "Stealth" theme.  
2.2 - (12/22/2010) Minor css tweaks and scrolling adjustments.  
2.2 - (12/13/2010) Updates for Linkinus 2.2: minor app API change regression fixes, removed unnecessary 'window.' references, added 'spam()' method for chat debugging, made smooth scrolling over 9000 times faster  
2.0 - (8/28/2009) Initial release
