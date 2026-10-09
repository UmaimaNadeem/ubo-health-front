/**
 * Google Translate changes React-managed DOM nodes directly.
 *
 * React can later try to remove or insert a node that Google Translate
 * has already replaced, which can cause a NotFoundError and blank the UI.
 *
 * These guards prevent that translated-DOM mismatch from crashing
 * the entire React application.
 */
export const applyTranslateDomGuards = () => {
  if (typeof Node !== "function" || !Node.prototype) return;

  const originalRemoveChild = Node.prototype.removeChild;

  Node.prototype.removeChild = function removeChild<T extends Node>(
    child: T,
  ): T {
    if (child.parentNode !== this) return child;

    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;

  Node.prototype.insertBefore = function insertBefore<T extends Node>(
    node: T,
    reference: Node | null,
  ): T {
    if (reference && reference.parentNode !== this) {
      return node;
    }

    return originalInsertBefore.call(
      this,
      node,
      reference,
    ) as T;
  };
};