# TCSS491 Character Creator

Web-based character creator built for extensibility

## TODO

**Prototype:**

Feb. 1

- EMERGENCY (kind of): sometimes images loaded as blobs just don't. render??? this happened 
consistently when loading an extension after the base ones have loaded, whether any base ones
were loaded or not. from what i can tell the issue is that the `await` in `main.addUserExtension`
just. isn't awaiting enough?? my hacky solution of drawing after a 10ms timeout works as a patch,
but this behaviour seems so dumb that it has to be my fault somehow. what tf. this would probably
work fine if i actually had the engine looping, but i kinda want to avoid redrawing the canvas
that much for performance (i know, it's fine, i just want to anyway)

- Implement asset selection UI (research UI on JS canvas)
    - basically a cute lil tabbed interface, but on a canvas
    - diff tabs for all the categories
    - seperate class? just part of the GameEngine? i 'unno

- Implement adding/removing assets
    - toggle in the asset list? (super easy, maybe prototype ver?)
    - seperate list of assets? (allows adding multiple of the same)

**MVP:**

- Implement drag-n-drop on movable assets
    - base GameEngine has some functionality, but don't be afraid to rip it out and make it work for this
    - Arrow buttons on UI for more precise movements

- Make sure post-load assets are added to UI (from user uploading extensions)
    - also that they're added to categories right. should just work depending on implementation.

- Implement changing asset settings
    - Decide if `colorMode = picker` should allow full HSV selection or just hue (HSV could fuck up lineart)

- Implement pic exporting
    - Just grab the creator region of the canvas and save as png. easy <- has no idea and will probably be badly surprised

**Final:**

- Implement a few keyboard shortcuts
    - Arrow keys for moving assets precisely
    - if I end up making assets selectable, `Del` to remove an asset
    - Swap between asset categories, maybe full `Tab` + `Enter` control? tough on canvas prolly

- Polish up interface, site design, etc.
    - maybe some lil bouncy animation effects on the canvas UI
    - could bash my head against that gradient tiling issue on the background

- Playtest!!! and fix shit from that.

**Like-to-do:**

- Implement other filetypes for assets (animated GIFs!!! yippee!!)

- Create extension-builder tool, generating the `.zip` and `specification.toml`

- ooooo maybe add a way to share creations? like, maybe including loaded extensions, or requiring loading dependencies first? would be sick.

- get some people to try making extension packs. :3