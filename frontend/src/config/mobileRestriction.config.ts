/**
 * Mobile Restriction Feature Configuration
 *
 * This configuration controls the mobile device restriction feature.
 * To disable mobile restrictions, set ENABLE_MOBILE_RESTRICTION to false.
 *
 * @removable - This entire file can be deleted when mobile support is ready.
 */

export const MOBILE_RESTRICTION_CONFIG = {
  /**
   * Feature flag - set to false to disable all mobile restrictions.
   * When false, mobile users can access login, register, and dashboard normally.
   */
  ENABLE_MOBILE_RESTRICTION: true,

  /**
   * Message shown on login and register pages when on mobile.
   */
  MESSAGE:
    'Pericles is currently available for desktop web only. Mobile support is coming soon!',

  /**
   * Toast message shown when mobile user is logged out from dashboard.
   */
  TOAST_MESSAGE:
    'Please use Pericles on desktop. Mobile support is coming soon!',

  /**
   * Screen width breakpoint (in pixels) below which is considered mobile.
   * 768px aligns with Tailwind's md: breakpoint.
   */
  MOBILE_BREAKPOINT: 768,
} as const;
