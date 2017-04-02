import {Injectable} from '@angular/core';

@Injectable()
export class GlobalEvent_Svc {
	private _settings = {
		resizeTimeoutTime: 80
	};

	//Resize-related
	private resizeHandlers = [];
	private resizeHandlerID = 0;
	private resizeTimeout = null;
	private lastResizeEvent = null;

	//Scroll-related
	private scrollHandlers = [];
	private scrollHandlerID = 0;
	private pendingScrollHandlers = false;
	private lastScrollEvent = null;

	//Pointer-related
	private pointerMoveHandlers = [];
	private pointerMoveHandlerID = 0;
	private pendingPointerMoveHandlers = false;
	private lastPointerEvent = null;

	//Cached elements
	private window = window;
	private body = document.getElementsByTagName('body')[0];

	constructor() {
	}

	/**
	 * Registers a handler to perform when window.resize occurs. This should be the single point globally where resize
	 * events are handled.
	 *
	 * @param handler   {function}      The handler function to be executed on window.resize
	 *
	 * @returns {int}                   Returns an integer ID number of the handler to be called with the
	 *                                   unregisterResizeHandler() method so it knows what to unregister.
	 */
	registerResizeHandler(handler) {
		let h = this.ResizeHandlerInstance(handler);

		this.resizeHandlers.push(h);
		//When adding the first listener, add the window.onresize handler
		if (this.resizeHandlers.length === 1) {
			this.window.addEventListener('resize', this.resizeHandler.bind(this));
		}

		return h.id;
	};

	/**
	 * Registers a handler to perform when window.onscroll occurs. This should be the single point globally where scroll
	 * events are handled.
	 *
	 * @param handler   {function}      The handler function to be executed on window.onscroll
	 *
	 * @returns {int}                   Returns an integer ID number of the handler to be called with the
	 *                                   unregisterScrollHandler() method so it knows what to unregister.
	 */
	registerScrollHandler(handler) {
		let h = this.ScrollHandlerInstance(handler);

		this.scrollHandlers.push(h);
		//When adding the first listener, add the window.scroll handler
		if (this.scrollHandlers.length === 1) {
			this.window.addEventListener('scroll', this.scrollHandler.bind(this));
		}

		return h.id;
	};

	/**
	 * Registers a pointer handler to perform when body.onmousemove or body.touchmove occurs. This should be the
	 * single point globally where body-only mousemove/touchmove events are handled.
	 * Should be used sparingly, obviously.
	 *
	 * @param handler   {function}      The handler function to be executed on body.onmousemove or body.ontouchmove
	 *
	 * @returns {int}                   Returns an integer ID number of the handler to be called with the
	 *                                   unregisterPointerMoveHandler() method so it knows what to unregister.
	 */
	registerPointerMoveHandler(handler) {
		let h = this.PointerMoveHandlerInstance(handler);

		this.pointerMoveHandlers.push(h);
		//When adding the first listener, add the global handler
		if (this.pointerMoveHandlers.length === 1) {
			this.body.addEventListener('mousemove touchmove', this.pointerMoveHandler.bind(this));
		}

		return h.id;
	};

	/**
	 * Unregister a resize handler with a given ID
	 *
	 * @param id    {int}               The ID of the resize handler to unregister, given by the return value of the
	 *                                  registerResizeHandler() method.
	 */
	unregisterResizeHandler(id) {
		for (let i = 0; i < this.resizeHandlers.length; i++) {
			let h = this.resizeHandlers[i];
			if (h.id === id) {
				this.resizeHandlers.splice(i, 1);
				break;
			}
		}

		//When unregistering the last handler, remove the window.onresize handler
		if (!this.resizeHandlers.length) {
			this.window.removeEventListener('resize', this.resizeHandler);
		}
	};

	/**
	 * Unregister a scroll handler with a given ID
	 *
	 * @param id    {int}               The ID of the scroll handler to unregister, given by the return value of the
	 *                                   registerScrollHandler() method.
	 */
	unregisterScrollHandler(id) {
		for (let i = 0; i < this.scrollHandlers.length; i++) {
			let h = this.scrollHandlers[i];
			if (h.id === id) {
				this.scrollHandlers.splice(i, 1);
				break;
			}
		}
		//When unregistering the last handler, remove the window.onscroll handler
		if (!this.scrollHandlers.length) {
			this.window.removeEventListener('scroll', this.scrollHandler);
		}
	};

	/**
	 * Unregister a pointer handler with a given ID
	 *
	 * @param id    {int}               The ID of the pointer move handler to unregister, given by the return value of
	 *                                   the registerPointerMoveHandler() method.
	 */
	unregisterPointerMoveHandler(id) {
		for (let i = 0; i < this.pointerMoveHandlers.length; i++) {
			let h = this.pointerMoveHandlers[i];
			if (h.id === id) {
				this.pointerMoveHandlers.splice(i, 1);
				break;
			}
		}
		//When unregistering the last handler, remove the global handler
		if (!this.pointerMoveHandlers.length) {
			this.body.removeEventListener('mousemove touchmove', this.pointerMoveHandler);
		}
	};


	/**
	 * Requests that all scroll handlers be called. The reason this is a 'request' is because to stay performant it's
	 * wrapped in a window.rAF call and may not fire listeners if a pending call is waiting to occur.
	 *
	 * @private
	 */
	private scrollHandler(e) {
		this.lastScrollEvent = e;

		if (!this.pendingScrollHandlers) {
			window.requestAnimationFrame(this.callScrollHandlers);
		}
		this.pendingScrollHandlers = true;
	}


	/**
	 * Calls all scroll handlers and sets the last scrollEvent to null.
	 *
	 * @private
	 */
	private callScrollHandlers() {
		for (let i = 0; i < this.scrollHandlers.length; i++) {
			(this.scrollHandlers[i].handler)(this.lastScrollEvent);
		}
		this.pendingScrollHandlers = false;
		this.lastScrollEvent = null;
	}


	/**
	 * Handle a resize event, if applicable. Won't fire until the user is 'done' resizing the window (meaning they've
	 * not caused a resize event to occur in over 150ms).
	 *
	 * @private
	 */
	private resizeHandler(e) {
		window.clearTimeout(this.resizeTimeout);
		this.lastResizeEvent = e;

		//If user stops resizing, call all handlers passing the last resize event, and then set it to null.
		this.resizeTimeout = window.setTimeout(() => {
			for (let i = 0; i < this.resizeHandlers.length; i++) {
				(this.resizeHandlers[i].handler)(this.lastResizeEvent);
			}
			this.lastResizeEvent = null;
		}, this._settings.resizeTimeoutTime);
	}


	/**
	 * Requests that all pointer move handlers be called. The reason this is a 'request' is because to stay performant
	 * it's wrapped in a window.rAF call and may not fire listeners if a pending call is waiting to occur.
	 *
	 * @private
	 */
	private pointerMoveHandler(e) {
		this.lastPointerEvent = e;

		if (!this.pendingPointerMoveHandlers) {
			window.requestAnimationFrame(this.callPointerMoveHandlers);
		}
		this.pendingPointerMoveHandlers = true;
	}


	/**
	 * Calls all pointer move handlers
	 *
	 * @private
	 */
	private callPointerMoveHandlers() {
		for (let i = 0; i < this.pointerMoveHandlers.length; i++) {
			(this.pointerMoveHandlers[i].handler)(this.lastPointerEvent);
		}
		this.pendingPointerMoveHandlers = false;
		this.lastPointerEvent = null;
	}


	/**
	 * Creates a ResizeHandlerInstance object, to track ID and handler function.
	 *
	 * @param handler   {function}          The function to be executed as a handler
	 *
	 * @returns {{id: number, handler: function}}
	 *
	 * @throws {Error}    Will throw an error if the passed handler is not a function
	 *
	 * @constructor
	 */
	private ResizeHandlerInstance(handler) {
		//Requires a function for handler
		if (typeof handler !== 'function') {
			throw new Error('Cannot create ResizeHandlerInstance. Handler must be a function.');
		}

		return {
			id: ++this.resizeHandlerID,
			handler: handler
		};
	}


	/**
	 * Creates a ScrollHandlerInstance object, to track ID and handler function.
	 *
	 * @param handler   {function}          The function to be executed as a handler
	 *
	 * @returns {{id: number, handler: function}}
	 *
	 * @throws {Error}    Will throw an error if the passed handler is not a function
	 *
	 * @private
	 */
	private ScrollHandlerInstance(handler) {
		//Requires a function for handler
		if (typeof handler !== 'function') {
			throw new Error('Cannot create ScrollHandlerInstance. Handler must be a function.');
		}

		return {
			id: ++this.scrollHandlerID,
			handler: handler
		};
	}


	/**
	 * Creates a PointerMoveHandlerInstance object, to track ID and handler function.
	 *
	 * @param handler   {function}              The function to be executed as a handler
	 *
	 * @returns {{id: number, handler: function}}
	 *
	 * @throws {Error}    Will throw an error if the passed handler is not a function
	 *
	 * @private
	 */
	private PointerMoveHandlerInstance(handler) {
		//Requires a function for handler
		if (typeof handler !== 'function') {
			throw new Error('Cannot create PointerMoveHandlerInstance. Handler must be a function.');
		}

		return {
			id: ++this.pointerMoveHandlerID,
			handler: handler
		};
	}
}