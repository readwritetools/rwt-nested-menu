










<figure>
	<img src='/img/components/nested-menu/iza-gawrych-oL3O2PybLoo-unsplash.jpg' width='100%' />
	<figcaption>Menus within menues</figcaption>
</figure>

# Nested Menu

## Accordian-style


<address>
<img src='/img/rwtools.png' width=80 /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2020-08-22>Aug 22, 2020</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-nested-menu</span> web component is an accordian-style dropdown navigation menu with two entry levels.</td></tr>
</table>

### Motivation

Sometimes you need to provide your website visitors with quick access to a large
quantity of pages without cluttering the main reading area of the page.

The <span>rwt-nested-menu</span> web component does this by keeping a
top of the page menu closed until the user needs it. When the menu is activated,
it pops down displaying several columns of menu items, where the number of
columns is automatically adjusted to match the space available and the number of
configured entries. Activation may also be initiated through the component's `toggleMenu`
method or through its event interface.

The component has these features:

   * First level menu items are shown by default. Second level menu items are shown
      when the user selects a first-level item.
   * The menu has both a keyboard and mouse interface.
   * Menu items may be kept separate from the web component, allowing the webmaster
      to change its contents in a single centralized place. Alternatively, menu items
      may be slotted directly between the component's opening and closing tags.
   * The menu item corresponding to the current page is highlighted and scrolled into
      view when the page is first loaded.
   * The menu has an event interface for showing and hiding itself.
   * The menu emits a custom event to close sibling menus and dialog boxes.
   * A keyboard listener is provided to allow a shortcut key to open/close the menu.

#### Prerequisites

The <span>rwt-nested-menu</span> web component works in any browser
that supports modern W3C standards. Templates are written using <span>BLUE
</span><span>PHRASE</span> notation, which can be compiled into HTML using the free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Installation using NPM

If you are familiar with Node.js and the `package.json` file, you'll be
comfortable installing the component just using this command:

```bash
npm install rwt-nested-menu
```

If you are a front-end Web developer with no prior experience with NPM, follow
these general steps:

   * Install <a href='https://nodejs.org'>Node.js/NPM</a>
on your development computer.
   * Create a `package.json` file in the root of your web project using the command:
```bash
npm init
```

   * Download and install the web component using the command:
```bash
npm install rwt-nested-menu
```


Important note: This web component uses Node.js and NPM and `package.json` as a
convenient *distribution and installation* mechanism. The web component itself
does not need them.

#### Installation using Github

If you are more comfortable using Github for installation, follow these steps:

   * Create a directory `node_modules` in the root of your web project.
   * Clone the <span>rwt-nested-menu</span> web component into it using
      the command:
```bash
git clone https://github.com/readwritetools/rwt-nested-menu.git
```


### Using the web component

After installation, you need to add two things to your HTML page to make use of
it.

   * Add a `script` tag to load the component's `rwt-nested-menu.js` file:
```html
<script src='/node_modules/rwt-nested-menu/rwt-nested-menu.js' type=module></script>             
```

   * Add the component tag somewhere on the page.

      * For scripting purposes, apply an `id` attribute.
      * Apply a `sourceref` attribute with a reference to an HTML file containing the
         menu's text and any CSS it needs.
      * Optionally, apply a `shortcut` attribute with something like `F9`, `F10`, etc. for
         hotkey access.
      * For WAI-ARIA accessibility apply a `role=navigation` attribute.
      * For simple menus, the `sourceref` may be omitted and the menu hyperlinks may be
         slotted into the web component. Simply place the hyperlinks directly between the
`<rwt-nested-menu>` and `</rwt-nested-menu>` tags.
```html
<rwt-nested-menu id=sitenav sourceref='/menu.html' shortcut=F9 role=navigation></rwt-nested-menu>
```


#### Menu template

#### Self identification

### Customization

#### Menu color scheme

The default color palette for the menu uses a dark mode theme. You can use CSS
to override the variables' defaults:

```css
rwt-nested-menu {
    --background: var(--nav-black);
    --level1-color: var(--title-blue);
    --level2-color: var(--pure-white);
    --accent-color: var(--yellow);
    --accent-background: var(--pure-black);
}
```

### Life-cycle events

The component issues life-cycle events.


<dl>
	<dt><code>component-loaded</code></dt>
	<dd>Sent when the component is fully loaded and ready to be used. As a convenience you can use the <code>waitOnLoading()</code> method which returns a promise that resolves when the <code>component-loaded</code> event is received. Call this asynchronously with <code>await</code>.</dd>
</dl>

### Event controllers

The menu can be controlled with its event interface.


<dl>
	<dt><code>toggle-nested-menu</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>toggle-nested-menu</code> messages. Upon receipt it will show or hide the menu.</dd>
	<dt><code>keydown</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>keydown</code> messages. If the user presses the configured shortcut key (<kbd>F9</kbd>, <kbd>F10</kbd>, etc) it will show/hide the menu. The <kbd>Esc</kbd> key hides the menu.</dd>
	<dt><code>collapse-popup</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>collapse-popup</code> messages, which are sent by sibling menus or dialog boxes. Upon receipt it will close itself.</dd>
	<dt><code>click</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>click</code> messages. When the user clicks anywhere outside the menu, it closes itself.</dd>
</dl>

### License

The <span>rwt-nested-menu</span> web component is licensed under the
MIT License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

### Availability


<table>
	<tr><td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-nested-menu'>github</a></td></tr>
	<tr><td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-nested-menu'>NPM</a></td></tr>
	<tr><td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/sitenav.blue'>Read Write Hub</a></td></tr>
</table>
