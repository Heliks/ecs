import { Subscriber } from "@heliks/event-queue";

/**
 * Classes that implement methods to subscribe to an event queue.
 *
 * @typparam T Event to which we are subscribing to.
 */
export interface Subscribable<T> {

  /**
   * Returns an iterator over all new events `T` since `subscriber` last consumed the
   * event queue.
   */
  events(subscriber: Subscriber): IterableIterator<T>;

  /**
   * Subscribes to the event queue and returns a `Subscriber`. The `Subscriber` can
   * then be used to read events from the queue.
   *
   * Note: Each subscriber must consume the queue or the queue is prevented from
   * shrinking which can lead to memory leaks.
   */
  subscribe(): Subscriber;

}
