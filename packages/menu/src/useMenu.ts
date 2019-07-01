import { Ref } from "react";
import useMenuRef from "./useMenuRef";
import useCloseOnScroll from "./useCloseOnScroll";
import useCloseOnOutsideClick from "./useCloseOnOutsideClick";
import useMenuClick from "./useMenuClick";
import useMenuKeyDown from "./useMenuKeyDown";

export interface MenuOptions {
  /**
   * An optional ref to be merged into the menu's required ref handler.
   */
  ref?: Ref<HTMLDivElement | null>;

  /**
   * Boolean if the menu is currently visible.
   */
  visible: boolean;

  /**
   * The id of the element that controls the menu's visibility. This
   * is required so that the menu won't be closed when the control
   * element is clicked since it'll have it's own toggle functionality
   * built-in already.
   */
  controlId: string;

  /**
   * Boolean if the menu is oriented horizontally instead of vertically.
   * This will update the keydown handlers to use the `ArrowLeft` and `ArrowRight`
   * keys instead of `ArrowUp` and `ArrrowDown` to navigate.
   */
  horizontal?: boolean;

  /**
   * An optional click handler to call when the `Menu` (or any child item) is
   * clicked. This will be merged with the default implementation to close the
   * menu once clicked.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * An optional keydown handler to call when the `Menu` (or any child item)
   * triggers a keydown event. This will be merged witht he default logic
   * of allowing items to be focused with the arrow keys or closing when the
   * escape or tab key is pressed.
   */
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;

  /**
   * The function that should close the menu.
   */
  onRequestClose: () => void;

  /**
   * Boolean if the menu should no longer close when the page or any
   * outside element scrolled.
   */
  disableCloseOnScroll?: boolean;
}

/**
 * This hook is used to provide all the menu functionality within the `Menu` component.
 * It'll ensure that:
 *
 * - the menu will be closed if an element outside of the menu is clicked
 * - the menu items within the menu are keyboard focusable after typing or
 *   using the arrow keys
 * - the menu will close if the Escape key or Tab key is pressed (tab since it'll lose focus)
 * - conditionally close the menu if the page is scrolled while visible.
 */
export default function useMenu({
  ref: forwardedRef,
  visible,
  controlId,
  horizontal = false,
  onClick: propOnClick,
  onKeyDown: propOnKeyDown,
  onRequestClose,
  disableCloseOnScroll = false,
}: MenuOptions) {
  const { menu, ref } = useMenuRef(forwardedRef);
  const onScroll = useCloseOnScroll({
    menu,
    disabled: disableCloseOnScroll,
    onRequestClose,
  });

  useCloseOnOutsideClick({ menu, visible, controlId, onRequestClose });

  const onClick = useMenuClick({ onClick: propOnClick, onRequestClose });
  const onKeyDown = useMenuKeyDown({
    onKeyDown: propOnKeyDown,
    onRequestClose,
    horizontal,
  });

  return {
    ref,
    menuRef: menu,
    onScroll,
    onClick,
    onKeyDown,
  };
}