












<figure>
	<img src='/img/components/nested-menu/nested-menu-1500x750.jpg' width='100%' />
	<figcaption>Menus within menus</figcaption>
</figure>

##### Open Source DOM Component

# Nested Menu

## Multi-column expandable dropdown


<address>
<img src='/img/48x48/rwtools.png' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2020-08-22>Aug 22, 2020</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-nested-menu</span> DOM component is an expandable dropdown navigation panel, displayed in multi-column fashion, with items grouped into two levels.</td></tr>
</table>

### Motivation

Sometimes you need to provide your website visitors with quick access to a large
quantity of pages without cluttering the main reading area of the page.

The <span>rwt-nested-menu</span> DOM component does this by keeping a
menu collapsed at the top of the page until the user needs it.

When the menu is activated, it opens up as a multi-column panel, where the
number of columns is automatically adjusted to match the space available and the
number of configured items.

Activation may also be initiated through the component's `toggleMenu` method or
through its event interface.

The component has these features:

   * First level menu items are shown by default. Second level menu items are shown
      when the user selects a first-level item.
   * The menu has both a keyboard and mouse interface, with no risk of loosing focus
      when the mouse leaves the menu area.
   * The actual menu items are kept separate from the DOM component, allowing the
      webmaster to change its contents in a single centralized place.
   * The menu item corresponding to the current document is highlighted when the
      collapsed menu is first expanded.
   * The menu has an event interface for showing and hiding itself.
   * The menu emits a custom event to close sibling menus and dialog boxes, so that
      only one is open at a time.
   * A keyboard listener is provided to allow a shortcut key to open/close the menu.

#### In the wild

To see an example of this component in use, visit the <a href='https://bluephrase.com'><span class=bp>BLUE</span><span class=phrase>PHRASE</span></a>
website. It uses this component for the SYNTAX, SEMANTAX and STYLE buttons. To
understand what's going on under the hood, use the browser's inspector to view
the HTML source code and network activity, and follow along as you read this
documentation.

### Installation

#### Prerequisites

The <span>rwt-nested-menu</span> DOM component works in any browser
that supports modern W3C standards. Templates are written using <span>BLUE
</span><span>PHRASE</span> notation, which can be compiled into HTML using the free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Download


<details>
	<summary>Download using NPM</summary>
	<p><b>OPTION 1:</b> Familiar with Node.js and the <code>package.json</code> file?<br />Great. Install the component with this command:</p>
	<pre lang=bash>
npm install rwt-nested-menu<br />	</pre>
	<p><b>OPTION 2:</b> No prior experience using NPM?<br />Just follow these general steps:</p>
	<ul>
		<li>Install <a href='https://nodejs.org'>Node.js/NPM</a> on your development computer.</li>
		<li>Create a <code>package.json</code> file in the root of your web project using the command:</li>
		<pre lang=bash>
npm init<br />		</pre>
		<li>Download and install the DOM component using the command:</li>
		<pre lang=bash>
npm install rwt-nested-menu<br />		</pre>
	</ul>
	<p style='font-size:0.9em'>Important note: This DOM component uses Node.js and NPM and <code>package.json</code> as a convenient <i>distribution and installation</i> mechanism. The DOM component itself does not need them.</p>
</details>


<details>
	<summary>Download using Github</summary>
	<p>If you prefer using Github directly, simply follow these steps:</p>
	<ul>
		<li>Create a <code>node_modules</code> directory in the root of your web project.</li>
		<li>Clone the <span class=product>rwt-nested-menu</span> DOM component into it using the command:</li>
		<pre lang=bash>
git clone https://github.com/readwritetools/rwt-nested-menu.git<br />		</pre>
	</ul>
</details>

### Using the DOM component

After installation, you need to add two things to your HTML page to make use of
it.

   * Add a `script` tag to load the component's `rwt-nested-menu.js` file:
```html
<script src='/node_modules/rwt-nested-menu/rwt-nested-menu.js' type=module></script>             
```

   * Add the component tag somewhere on the page.

      * For scripting purposes, apply an `id` attribute.
      * Apply a `sourceref` attribute with a reference to an HTML file containing the
         intended menu items.
      * Optionally, apply a `shortcut` attribute with something like `F9`, `F10`, etc. for
         hotkey access.
      * For WAI-ARIA accessibility apply a `role=navigation` attribute.
```html
<rwt-nested-menu id=nested-menu sourceref='/menu.html' shortcut=F9 role=navigation></rwt-nested-menu>
```


#### Menu template

Each intended menu element should be defined (in the file specified in the
sourceref attribute) as an HTML anchor tag. There are two types of elements,
distinguished by classname: `group` and `item`. *Item* elements should have an `href` attribute
referencing its target document. *Group* elements should not include an `href` attribute.


All elements are siblings to each other, and there is no explicit hierarchy.
Rather it is implied that any item element following a group element belongs to
the preceding group element.

The text for each element will be clipped to fit on one line, so the text should
be short.

Here is an example, using <span>BLUE</span><span>PHRASE</span> notation, with
two groups.

```html
a .group ESCAPES
a .item `/syntax/escapes/escape.blue` escape
a .item `/syntax/escapes/unicode.blue` unicode

a .group NOTES
a .item `/syntax/notes/comment.blue` comment
a .item `/syntax/notes/remark.blue` remark
a .item `/syntax/notes/reply.blue` reply
a .item `/syntax/notes/placeholder.blue` placeholder
```

#### Self identification

The menu item corresponding to the current page can be highlighted if it
identifies itself to the menu, so as to provide a frame of reference for the
user. This is accomplished by adding `meta` tags to the page. So, referring to the
example, if the current page is `/syntax/escapes/unicode.blue` the meta tags would
be:

```html
<meta name=nested-menu:group content='ESCAPES' />
<meta name=nested-menu:item content='unicode' />
```

### Customization

#### Menu items

When expanded, the menu panel is positioned in a fixed location, a certain
distance from the top of the page. This should be set using the `--menu-top` variable.
Each element within the menu is sized using the `--item-height` and `--item-width` variables.
Here is an example:

```css
rwt-nested-menu {
    --menu-top: 0;
    --font-size: 0.8rem;
    --item-height: 2rem;
    --item-width: 11rem;
    --z-index: 1;
}
```

#### Menu color scheme

The default color palette for the menu uses a dark mode theme. You can use CSS
to override the variables' defaults:

```css
rwt-nested-menu {
    --color: var(--pure-white);
    --accent-color1: var(--title-blue);
    --accent-color2: var(--yellow);
    
    --menu-background: var(--medium-black);
    --group-background: var(--medium-black);
    --item-background: var(--black);
    --hover-background: var(--form-gray);
    --active-background: var(--pure-black);

    --thick-border: var(--pure-black);
    --thin-border: var(--light-black);
    --item-border: var(--white);
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
	<dt><code>toggle-menu</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>toggle-menu</code> messages. Upon receipt it will show or hide the menu.</dd>
	<dt><code>keydown</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>keydown</code> messages. If the user presses the configured shortcut key (<kbd>F9</kbd>, <kbd>F10</kbd>, etc) it will show/hide the menu. The <kbd>Esc</kbd> key hides the menu.</dd>
	<dt><code>collapse-popup</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>collapse-popup</code> messages, which are sent by sibling menus or dialog boxes. Upon receipt it will close itself.</dd>
	<dt><code>click</code></dt>
	<dd>The component listens on DOM <code>document</code> for <code>click</code> messages. When the user clicks anywhere outside the menu, it closes itself.</dd>
</dl>

---

### Reference


<table>
	<tr><td><img src='/img/48x48/read-write-hub.png' alt='DOM components logo' width=48 /></td>	<td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/nested-menu.blue'>READ WRITE HUB</a></td></tr>
	<tr><td><img src='/img/48x48/git.png' alt='git logo' width=48 /></td>	<td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-nested-menu'>github</a></td></tr>
	<tr><td><img src='/img/48x48/dom-components.png' alt='DOM components logo' width=48 /></td>	<td>Component catalog</td> 	<td><a href='https://domcomponents.com/components/nested-menu.blue'>DOM COMPONENTS</a></td></tr>
	<tr><td><img src='/img/48x48/npm.png' alt='npm logo' width=48 /></td>	<td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-nested-menu'>npm</a></td></tr>
	<tr><td><img src='/img/48x48/read-write-stack.png' alt='Read Write Stack logo' width=48 /></td>	<td>Publication venue</td>	<td><a href='https://readwritestack.com/components/nested-menu.blue'>READ WRITE STACK</a></td></tr>
</table>

### License

The <span>rwt-nested-menu</span> DOM component is licensed under the
MIT License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

