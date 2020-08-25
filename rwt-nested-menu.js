//=============================================================================
//
// File:         /node_modules/rwt-nested-menu/rwt-nested-menu.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2020
// License:      MIT
// Initial date: Aug 22, 2020
// Purpose:      Nested navigation menu with two entry levels
//
//=============================================================================

const Static = {
	componentName:    'rwt-nested-menu',
	elementInstance:  1,
	htmlURL:          '/node_modules/rwt-nested-menu/rwt-nested-menu.blue',
	cssURL:           '/node_modules/rwt-nested-menu/rwt-nested-menu.css',
	htmlText:         null,
	cssText:          null
};

Object.seal(Static);

export default class RwtNestedMenu extends HTMLElement {

	constructor() {
		super();
		
		// guardrails
		this.instance = Static.elementInstance++;
		this.isComponentLoaded = false;

		// properties
		this.collapseSender = `${Static.componentName} ${this.instance}`;
		this.shortcutKey = null;

		// child elements
		this.quickpicMenu = null;
		
		// meta content
		this.activeGroup = '';
		this.activeItem = '';
		
		Object.seal(this);
	}
	
	//-------------------------------------------------------------------------
	// customElement life cycle callback
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		if (!this.isConnected)
			return;
		
		try {
			var htmlFragment = await this.getHtmlFragment();
			var styleElement = await this.getCssStyleElement();

			var fragmentWithAnchors = await this.fetchMenu();
			if (fragmentWithAnchors != null) {
				var elQuickpicMenu = htmlFragment.getElementById('quickpicMenu');
				elQuickpicMenu.appendChild(fragmentWithAnchors);
			}

			this.attachShadow({mode: 'open'});
			this.shadowRoot.appendChild(htmlFragment); 
			this.shadowRoot.appendChild(styleElement); 
			
			this.identifyChildren();
			this.registerEventListeners();
			this.initializeShortcutKey();
			this.getNestedMenuMeta();
			this.setupGroupListeners();
			this.hideMenu();
			this.sendComponentLoaded();
		}
		catch (err) {
			console.log(err.message);
		}
	}
	
	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	// Only the first instance of this component fetches the HTML text from the server.
	// All other instances wait for it to issue an 'html-template-ready' event.
	// If this function is called when the first instance is still pending,
	// it must wait upon receipt of the 'html-template-ready' event.
	// If this function is called after the first instance has already fetched the HTML text,
	// it will immediately issue its own 'html-template-ready' event.
	// When the event is received, create an HTMLTemplateElement from the fetched HTML text,
	// and resolve the promise with a DocumentFragment.
	getHtmlFragment() {
		return new Promise(async (resolve, reject) => {
			var htmlTemplateReady = `${Static.componentName}-html-template-ready`;
			
			document.addEventListener(htmlTemplateReady, () => {
				var template = document.createElement('template');
				template.innerHTML = Static.htmlText;
				resolve(template.content);
			});
			
			if (this.instance == 1) {
				var response = await fetch(Static.htmlURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${Static.htmlURL} returned with ${response.status}`));
					return;
				}
				Static.htmlText = await response.text();
				document.dispatchEvent(new Event(htmlTemplateReady));
			}
			else if (Static.htmlText != null) {
				document.dispatchEvent(new Event(htmlTemplateReady));
			}
		});
	}
	
	// Use the same pattern to fetch the CSS text from the server
	// When the 'css-text-ready' event is received, create an HTMLStyleElement from the fetched CSS text,
	// and resolve the promise with that element.
	getCssStyleElement() {
		return new Promise(async (resolve, reject) => {
			var cssTextReady = `${Static.componentName}-css-text-ready`;

			document.addEventListener(cssTextReady, () => {
				var styleElement = document.createElement('style');
				styleElement.innerHTML = Static.cssText;
				resolve(styleElement);
			});
			
			if (this.instance == 1) {
				var response = await fetch(Static.cssURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${Static.cssURL} returned with ${response.status}`));
					return;
				}
				Static.cssText = await response.text();
				document.dispatchEvent(new Event(cssTextReady));
			}
			else if (Static.cssText != null) {
				document.dispatchEvent(new Event(cssTextReady));
			}
		});
	}

	//^ Fetch the user-specified menu items from the file specified in
	//  the custom element's sourceref attribute, which is a URL.
	//
	//  That file should contain HTML with <a> items like this:
	//  <a class=group href=javascript:;>ESCAPES</a>						// generic items
	//  <a class=item href='/syntax/escapes/escape.blue'>escape</a>			// specific items
	//
	//< returns a document-fragment suitable for appending to the component's 'quickpicMenu' element
	//< returns null if the user has not specified a sourceref attribute or
	//  if the server does not respond with 200 or 304
	async fetchMenu() {
		if (this.hasAttribute('sourceref') == false)
			return null;
		
		var sourceref = this.getAttribute('sourceref');

		var response = await fetch(sourceref, {cache: "no-cache", referrerPolicy: 'no-referrer'});		// send conditional request to server with ETag and If-None-Match
		if (response.status != 200 && response.status != 304)
			return null;
		var templateText = await response.text();
		
		// create a template and turn its content into a document fragment
		var template = document.createElement('template');
		template.innerHTML = templateText;
		return template.content;
	}

	//^ Identify this component's children
	identifyChildren() {
		this.quickpicMenu = this.shadowRoot.getElementById('quickpicMenu');
	}		

	registerEventListeners() {
		// window events
		window.addEventListener('resize', this.resizeQuickpic.bind(this));

		// document events
		document.addEventListener('click', this.onClickDocument.bind(this));
		document.addEventListener('keydown', this.onKeydownDocument.bind(this));
		document.addEventListener('collapse-popup', this.onCollapsePopup.bind(this));
		document.addEventListener('toggle-menu', this.onToggleEvent.bind(this));
		
		// component events
		this.quickpicMenu.addEventListener('click', this.onClickQuickpicMenu.bind(this));
	}

	//^ Get the user-specified shortcut key. This will be used to open the dialog.
	//  Valid values are "F1", "F2", etc., specified with the *shortcut attribute on the custom element
	initializeShortcutKey() {
		if (this.hasAttribute('shortcut'))
			this.shortcutKey = this.getAttribute('shortcut');
	}

	//^ Get the menu group and item corresponding to this document
	//  For this to work, the document should have these tags in its <head>
	//    <meta name=nested-menu:group content='groupname' />
	//    <meta name=nested-menu:item content='itemname' />
	getNestedMenuMeta() {
		// get group and item values from the document's <meta> elements
		var meta = document.querySelector('meta[name="nested-menu:group"]')
		if (meta != null) {
			this.activeGroup = meta.getAttribute('content');
			if (this.activeGroup == null)
				this.activeGroup = '';
		}
		meta = document.querySelector('meta[name="nested-menu:item"]')
		if (meta != null) {
			this.activeItem = meta.getAttribute('content');
			if (this.activeItem == null)
				this.activeItem = '';
		}
	}
	
	setupGroupListeners() {
		var grpElements = this.shadowRoot.querySelectorAll('.group');
		for (var i = 0; i < grpElements.length; i++) {
			grpElements[i].setAttribute('href', 'javascript:	;');
			grpElements[i].addEventListener('click', this.onClickGroup.bind(this));
		}
	}

	//^ Inform the document's custom element that it is ready for programmatic use 
	sendComponentLoaded() {
		this.isComponentLoaded = true;
		this.dispatchEvent(new Event('component-loaded', {bubbles: true}));
	}

	//^ A Promise that resolves when the component is loaded
	waitOnLoading() {
		return new Promise((resolve) => {
			if (this.isComponentLoaded == true)
				resolve();
			else
				this.addEventListener('component-loaded', resolve);
		});
	}
	
	//-------------------------------------------------------------------------
	// document events
	//-------------------------------------------------------------------------
	
	// User has clicked on the document
	onClickDocument(event) {
		this.hideMenu();
		event.stopPropagation();
	}

	// close the dialog when user presses the ESC key
	// toggle the dialog when user presses the assigned shortcutKey
	onKeydownDocument(event) {		
		if (event.key == "Escape") {
			this.hideMenu();
			event.stopPropagation();
		}
		// like 'F1', 'F2', etc
		if (event.key == this.shortcutKey && this.shortcutKey != null) {
			this.toggleMenu(event);
			event.stopPropagation();
			event.preventDefault();
		}
	}

	//^ Send an event to close/hide all other registered popups
	collapseOtherPopups() {
		var collapseEvent = new CustomEvent('collapse-popup', {detail: this.collapseSender});
		document.dispatchEvent(collapseEvent);
	}
	
	//^ Listen for an event on the document instructing this component to close/hide
	//  But don't collapse this component, if it was the one that generated it
	onCollapsePopup(event) {
		if (event.detail == this.collapseSender)
			return;
		else
			this.hideMenu();
	}
	
	//^ Anybody can use: document.dispatchEvent(new Event('toggle-menu'));
	// to open/close this component.
	onToggleEvent(event) {
		event.stopPropagation();
		this.toggleMenu(event);
	}
	
	//-------------------------------------------------------------------------
	// component events
	//-------------------------------------------------------------------------

	// User has clicked in the menu panel, but not on a button
	onClickQuickpicMenu(event) {
		event.stopPropagation();
	}

	//-------------------------------------------------------------------------
	// component methods
	//-------------------------------------------------------------------------
	
	// open/close
	toggleMenu(event) {
		if (this.quickpicMenu.className == 'hide-menu')
			this.showMenu();
		else
			this.hideMenu();
		event.stopPropagation();
	}

	showMenu() {
		this.collapseOtherPopups();
		this.quickpicMenu.className = 'show-menu';
		this.prepareForActiveUse();
	}

	hideMenu() {
		this.quickpicMenu.className = 'hide-menu';
	}
	
	//-------------------------------------------------------------------------
	// quickpic methods
	//-------------------------------------------------------------------------

	prepareForActiveUse() {		
		var elActiveGroup = null;
		for (let i=0; i < this.quickpicMenu.children.length; i++) {
			var child = this.quickpicMenu.children[i];
			if (child.classList.contains('group')) {
				if (this.isActiveGroup(child.innerText)) {
					child.classList.add('open');								// use CSS to display text in blue
					this.expandGroup(child, true);
				}
			}
		}
		this.resizeQuickpic();
	}
	
	// This determines whether or not the displayText is the "active" group
	//> displayText is like "FURIGANA" or "I/O"
	//> The active group is like "furigana" or "io"
	//  Case-sensitivity is handled by puting the displayText into lowercase
	//  Non-alphabetic characters are simply removed
	isActiveGroup(displayText) {
		return this.activeGroup == displayText.toLowerCase().replace('/', '-');
	}
	
	// This determines whether or not the displayText is the "active" item
	//> displayText is like "h1" or "div" or "span"
	isActiveItem(displayText) {
		return this.activeItem == displayText;
	}

	// The user has clicked on a quickpic group, expand or collapse its children
	onClickGroup(event) {
		var elGroup = event.target;
		elGroup.classList.toggle('open');								// use CSS to display text in blue
		this.expandGroup(elGroup, false);	
		this.resizeQuickpic();
	}

	// Make all of the quickpic items immediately following the given group element visible
	// Children in the menu are either 'group' or 'item'
	// Each group item is associated with one or more items, which are immediate siblings
	//> elGroup is the group element whose items are to be shown
	//> forceOpen should be true for the activeGroup during prepareForActiveUse()
	expandGroup(elGroup, forceOpen) {
		if (elGroup == null)
			return;
		
		// show/hide all the quickpicItems of the clicked group element
		var nodeSibling = elGroup.nextSibling;
		while (nodeSibling != null) {
			if (nodeSibling.nodeType == Node.ELEMENT_NODE) {
				if (nodeSibling.classList.contains('item')) {
					if (nodeSibling.style.display == 'block' && forceOpen == false) 
						nodeSibling.style.display = 'none';				// hide item
					else {
						nodeSibling.style.display = 'block';			// display item
						if (this.isActiveItem(nodeSibling.innerText)) {
							nodeSibling.classList.add('activename');	// use CSS to add ◀  xxx ►
							nodeSibling.focus();
						}
					}
				}
				else // classname == 'group'
					break;												// no more quickpicItems for this group	
			}
			nodeSibling = nodeSibling.nextSibling;
		}
	}
	
	// Call this whenever the window width changes or whenever items are added or removed from the menu
	// It will calculate how many columns will fit in the quickpic menu area, and determine the overall
	// height required to fit all of the visible menuitems.
	resizeQuickpic() {
		var qpBordersWidth = this.quickpicMenu.offsetWidth - this.quickpicMenu.clientWidth;		// width of left-border + right-border
		var qpBordersHeight = this.quickpicMenu.offsetHeight - this.quickpicMenu.clientHeight;	// height of top-border + bottom-border
		var itemCount = 0;
		var itemHeight = 0;
		var itemWidth = 0;
		
		// count how many menuitems are visible, and find their width and height
		for (let i=0; i < this.quickpicMenu.children.length; i++) {
			var item = this.quickpicMenu.children[i];
			if (item.nodeType == Node.ELEMENT_NODE && item.nodeName == 'A' && item.offsetParent !== null) {
				itemHeight = Math.max(itemHeight, item.offsetHeight);
				itemWidth  = Math.max(itemWidth, item.offsetWidth);
				itemCount++;
			}
		}
		
		if (itemCount == 0) {
			this.quickpicMenu.style.height = '0px';
			return;
		}
		
		// determine how many columns will fit
		var columnCount = Math.floor((this.quickpicMenu.offsetWidth - qpBordersWidth) / itemWidth);
		if (columnCount < 1)
			columnCount = 1;
		
		// caclulate quickpic height
		var itemsPerColumn = Math.ceil(itemCount / columnCount);
		var flexFudge = itemsPerColumn;	// flex doesn't like to squeeze items into tight boxes
		var quickPicHeight = (itemsPerColumn * itemHeight) + qpBordersHeight + flexFudge;
		this.quickpicMenu.style.height = quickPicHeight + 'px';
	}
		
}

window.customElements.define(Static.componentName, RwtNestedMenu);
