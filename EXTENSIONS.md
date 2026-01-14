# Extensions

Extensions are packs of assets (bases, accessories, anything you can pick in the creator) and
their configurations. This page describes how extensions are formatted, and how you can make
an extension yourself!

The character creator comes with two extensions by default, the Dragon extension and the Demo
Extension. For this tutorial, we'll be using the Demo extension as an example for how to build
an extension

## How to Make an Extension

Making an extension takes several steps, but they're each quite simple so don't worry! Let's
start with some short explanations of each step, then move on to more detailed instructions.

1) Make your assets

These can be hand-drawn, pulled from somewhere else (with permission hopefully), or anything
else. They must be images in the `.png` format (i'm working on addingsupport for other
formats!). I don't cover this step in this tutorial, because I'm assuming you already have
something you want to use, or know how to make something new.

2) Put your assets into an extension

For this bit, all you have to do is move your assets into a folder for your extension, and
make sure the folder is structured properly for an extension. We'll go over this step in more
detail in just a bit.

3) Write your specification file

You will write a `specification.toml` file which tells the program how to use your assets and
what people can do with them. This file has a very particular format, which we'll cover in a
moment.

4) Export your extension

Finally, you can export your extension by compressing it to a `.zip` file and sharing it for
others to use (or just playing with it yourself)!

5) Import your extension

This step is the easiest part, where you upload your `.zip` file extension to the character
creator and let it work!

## Terms

Okay, before we start here's some definitions for the terms we'll be using:

- TOML: Tom's Obvious Minimal Language, the language the `specification.toml` file is written
in. To learn the basics of the language (which you'll need!), check out [the documentation](https://toml.io/en/v1.1.0).

- The program: This program, the Character Creator! This is all the stuff I made which makes
extensions work.

- The user: This is the person using the program, which could be me, you, or anyone else. I'll
often use this in reference to the person using your extension.

- All caps words (like `NAMESPACE`) denote variables, which are up to you (potentially with
some restrictions, so check the comments!)

- Asset: Anything you can select inside the actual interface when making a character.

- Resource: Individual files inside an extension, excepting the `specification.toml` which is
special.

- Extension/Extension Pack: A structured folder of resources and `specification.toml` file with a unique name.

- Specification: The variables describing how an asset can be used, by the program and by the
user. Specifications for extensions and assets are stored in the `specification.toml` file.

- Optional Variables: These are variables which are up to you to include or not! You can tell
which variables are optional, because the comment describing them will tell you front and
center. The comment will also tell you what will happen if you don't include the variable.
(the comment will start with "Optional" and then describe the default case)

- Conditionally Required Variables: These are variables that are sometimes required, but
sometimes not. The comment describing the variable will tell you when it is required and
what it does. (the comment will start with "Required if")

## Assumptions

These are the assumptions I'm making in this tutorial, and if any of them isn't true for you,
you might struggle with some parts of this tutorial.

1) You know how to download files.

2) You know how to rename, move, and find files on your filesystem.

3) You already have resources you want to use, or if you don't and plan on making an extension
anyways, you know how to make or find resources to use.

4) You know how to edit a text file, and have read [the documentation](https://toml.io/en/v1.1.0)
for the TOML language.

5) You know how to compress a folder to a `.zip` file.

If you're missing any of these assumptions, go off and look up how to do them, and then come
back to this tutorial!

And now, onto the details!

## (2) Extension Structure

```
NAMESPACE/
├─ resources/
│  └─...
└─ specification.toml
```

The folder structure of an extension is fairly relaxed but there are a couple of rules you'll
need to follow when making your extension.

First, the `NAMESPACE` can be whatever name you like, so long as it doesn't conflict with
any other loaded extensions. For example, you can't name your extension `demo` or `dragon`
because those are the names of the two extensions included in the program by default.

`specification.toml` **MUST** be in this location, just inside the namespace, and **MUST**
be named `specification.toml`. If you don't do this properly, the program will show you an
error when you try to load your extension.

`resources/` is a folder containing all the resources for your extension. You can technically
have any folder structure you like, so long as the `specification.toml` is in the right place,
but I highly recommend that you organize your resources so they're easier to find. One way you
can do this is to put all your resources in the `resources/` folder, or you could make
subfolders inside there to make finding files even easier!

## (3) Specification File

This is where all the magic happens. The `specification.toml` file describes to the program how
your assets should work, and what the user should be able to do with them.

> *For the moment, you'll have to do all the editing for this file yourself, but I have plans to
make a tool that will do a lot of the configuration for you, so look out for that if you don't
want to write it yourself!*

The first section of the `specification.toml` file is for metadata about the extension itself.
This section contains the name, description, author, version, and other information that
describes the extension rather than the assets.

```toml
# Must be unique among loaded extensions
name = "NAME"
# Optional: Left blank if not included. May also be a multiline string
description = "DESCRIPTION"
# Optional: Left blank if not included. May also be a multiline string
author = "AUTHOR"
# Optional: Left blank if not included
version = "VERSION"
```

The next section describes all the assets included in the extension pack. If you'd like to see
an example `specification.toml`, you can find the demo [here](https://github.com/RaidenH-UWT/TCSS491-Character-Creator/blob/main/site/extensions/demo/specification.toml).

Indentation isn't required, but it is helpful if another person is reading your specification!

```toml
# Array containing all asset configurations as tables
[[assets]]
    name = "NAME"
    
    # Optional: Left blank if not included. May also be a multiline string
    description = "DESCRIPTION"
    
    # Optional: Listed in the 'Misc.' category if not included.
    # If the same as a category that already exists, will be included in that category
    category = "CATEGORY"
    
    # Must be among: [static, movable]
    type = "TYPE"
    
    # Must be among: [static, set, picker]
    # Static will use the color of the resource and not allow changing it
    # Set allows the user to pick from among several color options defined
    # by you.
    # Picker allows the user to use a color picker to choose any color for
    # the asset
    colorMode = "COLOR_MODE"
    
    # Required if colorMode = set, ignored otherwise
    # colorOptions may store any number of items, which should be hex
    # color codes (e.g. #E5074B)
    colorOptions = ["COLOR1", "COLOR2", ...]
    
    # Array containing the resources for this asset
    # This allows you to use multiple resources for one asset, for
    # instance if you want different pieces of the asset to be on
    # different layers.
    [[assets.resources]]
        # Absolute filepath from the root of the extension, to the resource
        path = "PATH"
        
        # Relative layer index for the resource to be drawn on
        # A higher number means this resource will be on drawn on top of
        # resources with a lower index.
        # For example values, see the demo or the dragon extensions.
        # If two assets are in the same location and have the same layer
        # index, there may be unexpected behaviour.
        layer = LAYER_INDEX
        
        # Optional: Set to 1 if not included.
        # Changes the scale the resource is drawn at. Useful for pixel art.
        scale = SCALE_MULTIPLIER
        
        # Integer (in pixels) x- and y-coordinates of the top-left corner
        # of the resource. This value is relative to the canvas, so if the
        # asset is static be sure this is in the right spot.
        # The canvas is a 1024x768 rectangle, with the point (0, 0) in the
        # top left corner and (1023, 767) in the bottom right corner.
        x = XCOORD
        y = YCOORD
```

And that's it! You can add several `[[assets.resources]]` tables (as per the TOML spec), and
several `[[assets]]` tables as well.

## (4) Exporting Your Extension

Finally, you can export your extension by compressing it into a `.zip` archive file. Once
you've made your zip file, you're ready to share and use it!

## (5) Importing Your Extension

To import your extension, open up [the program](https://raidenh-uwt.github.io/TCSS491-Character-Creator/)
again and click the "Browse" button then select your extension. If your extension is
improperly formatted, the program will give you an alert about the problem so you can fix it.




