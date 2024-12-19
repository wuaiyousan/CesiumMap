import mitt from "mitt";
const eventBus = mitt();
export function on(event, handler) {
  eventBus.on(event, handler);
}

export function off(event, handler) {
  eventBus.off(event, handler);
}

export function emit(event, ...args) {
  eventBus.emit(event, ...args);
}

export default eventBus;
