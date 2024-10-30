<?php

/**
 * Plugin Name: WP Classified
 * Plugin URI: https://wpclassified.io/
 * Description: Create your own marketplace to buy and sell your products online without any hiccups.
 * Version: 3.1.0
 * Author: WEN Solutions
 * Author URI: http://wensolutions.com
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Tested up to: 6.4.2
 *
 * Text Domain: classified
 * Domain Path: /i18n/languages/
 *
 * @package Classified
 * @category Core
 * @author WenSolutions
 */

// Namespace define
namespace Wp_Classified_Ads;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'please run this plugins in WordPress. Thank You.' );
}

if ( ! class_exists( 'Wp_Classified_Ads\Main' ) ) {
	/**
	 * Main Wp_Classified_Ads Class (singleton).
	 *
	 * @since 1.0
	 */
	final class Main {

		/**
		 * Classified version.
		 *
		 * @var string
		 */
		public $version = '3.1.0';
		/**
		 * Classified API version.
		 *
		 * @var string
		 */
		public $api_version = 'v1';

		/**
		 * The single instance of the class.
		 *
		 * @var Classified
		 * @since 1.0
		 */
		protected static $instance = null;

		/**
		 * Main WpClassifiedAds Instance.
		 * Ensures only one instance of WpClassifiedAdsl is loaded or can be loaded.
		 *
		 * @since 1.0
		 * @static
		 * @see WpClassifiedAds()
		 * @return WpClassifiedAds - Main instance.
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}
		/**
		 * WpClassifiedAds Constructor.
		 */
		public function __construct() {
			$this->define_constants();
			$this->includes();
			$this->init_hooks();
		}

		/**
		 * Create Init function
		 *
		 * All Hook List For all function
		 */
		public function init_hooks() {
			register_activation_hook( __FILE__, array( 'Wp_Classified_Ads\WP_Classified_Actions_Activation', 'init' ) );
			register_deactivation_hook( __FILE__, array( 'Wp_Classified_Ads\WP_Classified_Actions_Activation', 'deactivate' ) );
			// add_action( 'admin_menu', array( 'Wp_Classified_Ads\Classified_Ads_Admin', 'wp_classified_ads_menu_page' ) );
			add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );
			add_action( 'rest_api_init', array( 'Wp_Classified_Ads\Wp_Classified_Ads_Api_Lists_Register', 'wp_register_classified_ads_api_route' ) );
			add_action( 'init', array( 'WP_Classified_Ads\Frontend_Backend_Assets', 'inits' ) );
			$redirects = apply_filters( 'wp_classified_ads_redirect_home_page_after_reset_password', true );
			if ( $redirects ) {
				add_action( 'after_password_reset', array( 'Wp_Classified_Ads\Wp_Classified_Ads_Reset_Password', 'wp_classfied_user_redirect_after_reset_password' ) );
			}
		}

		/**
		 * Define plugins constant
		 *
		 * @return plugin paths, url, version etc
		 */
		public function define_constants() {
			$api_version    = apply_filters( 'wpclassified_ads_api_version', $this->api_version );
			$plugin_version = $this->version;
			self::define( 'WP_CLASSIFIED_ADS_POST_TYPE', 'wp-classified-ads' );
			self::define( 'WP_CLASSIFIED_ADS_ADS_TEXONOMY', 'classified-ads-type', 'classified' );
			self::define( 'WP_CLASSIFIED_ADS_PLUGIN_FILE', __FILE__ );
			self::define( 'WP_CLASSIFIED_ADS_ABSPATH', dirname( __FILE__ ) . '/' );
			self::define( 'WP_CLASSIFIED_ADS_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
			self::define( 'WP_CLASSIFIED_ADS_PLUGIN_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
			self::define( 'WP_CLASSIFIED_ADS_VERSION', $plugin_version );
			self::define( 'WP_CLASSIFIED_ADS_API_VERSION', $api_version );
			self::define( 'WP_CLASSIFIED_ADS_PLUGIN_URL', trailingslashit( plugins_url( '/', __FILE__ ) ) );
		}
		/**
		 * Classified file includings
		 */
		public function includes() {
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/admin/classified-ads-post-type.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/admin/script/react-script-load.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/string/admin-string-localize.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/admin/script/register-script.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/api-route/wp-classified-ads-api-list.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/api-route/wp-classified-ads-api-register.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-details/wp-classified-all-ads-list.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-details/wp-classified-single-ads-data.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-details/wp-classified-create-ads.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-details/wp-classified-edit-ads.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-details/wp-classified-delete-ads.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/user-authentications/sign-up.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/user-authentications/update-user.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/user-authentications/login-user.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/user-authentications/log-out.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/user-authentications/get-user.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/user-authentications/user-reset-password.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/templates/class-template-function.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/hook_list/single_ads_hook.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/admin/form/classified-form.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/classified-user/user-helper.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/shortcode/user_dashboard.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/activation/activated.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-favourite/add-favourite.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-gallery/remove-image.php';
			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/helpers/classified-helpers.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-ratting/ads-comment-ratting.php';

			require_once WP_CLASSIFIED_ADS_ABSPATH . '/inc/api/ads-inquiry/inquiry.php';

		}
		/**
		 * Define constant if not already set.
		 *
		 * @param  string $name  Name of constant.
		 * @param  string $value Value of constant.
		 * @return void ( define name and value )
		 */
		public static function define( $name, $value ) {
			if ( ! defined( $name ) ) {
				define( $name, $value ); // phpcs:ignore
			}
		}
		/**
		 * Load Localisation files.
		 *
		 * Note: the first-loaded translation file overrides any following ones if the same translation is present.
		 *
		 * Locales found in:
		 *      - WP_LANG_DIR/classified/classified-LOCALE.mo
		 *      - WP_LANG_DIR/plugins/classified-LOCALE.mo
		 */
		public function load_plugin_textdomain() {
			$locale = is_admin() && function_exists( 'get_user_locale' ) ? get_user_locale() : get_locale();
			$locale = apply_filters( 'classified_plugin_locale', $locale, 'classified' ); // phpcs:ignore
			unload_textdomain( 'classified' );
			load_textdomain( 'classified', WP_LANG_DIR . '/classified/classified-' . $locale . '.mo' );
			load_plugin_textdomain( 'classified', false, dirname( plugin_basename( __FILE__ ) ) . '/i18n/languages' );
		}
	}
}

/**
 * Main instance of Classified.
 *
 * Returns the main instance of WpClassifiedAds to prevent the need to use globals.
 *
 * @since  1.0
 * @return Classified
 */
function WpClassifiedAds() {
	return Main::instance();
}

/*
 * Start Classified.
 */
WpClassifiedAds();
