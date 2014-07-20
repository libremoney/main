/**!
 * LibreMoney Listeners 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Listeners() {
	this.listenersMap = new Array();
	return this;
}


function AddListener(listener, eventType) {
	var listeners = this.listenersMap[eventType];
	if (listeners == null) {
		listeners = new Array(); //CopyOnWriteArrayList<>();
		this.listenersMap[eventType] = listeners;
	}
	return listeners.push(listener);
}

function Notify(t, eventType) {
	throw new Error('Not implemented');
	/*
	List<Listener<T>> listeners = listenersMap.get(eventType);
	if (listeners != null) {
		for (Listener<T> listener : listeners) {
			listener.notify(t);
		}
	}
	*/
}

function RemoveListener(listener, eventType) {
	throw new Error('Not implemented');
	/*
	synchronized (eventType) {
		List<Listener<T>> listeners = listenersMap.get(eventType);
		if (listeners != null) {
			return listeners.remove(listener);
		}
	}
	return false;
	*/
}


Listeners.prototype.AddListener = AddListener;
Listeners.prototype.Notify = Notify;
Listeners.prototype.RemoveListener = RemoveListener;


module.exports = Listeners;
