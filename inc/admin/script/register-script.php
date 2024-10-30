<?php
/**
 * Frontend / Backend style and script register file.
 *
 * @package WP_Classified_Ads
 */
namespace WP_Classified_Ads;

/**
 * Frontend_Backend_Assets class.
 */
if ( ! class_exists( 'Frontend_Backend_Assets' ) ) {
	class Frontend_Backend_Assets {
		/**
		 * Url Upto plugin dir.
		 *
		 * @var string
		 */
		private static $plugin_path;

		/**
		 * Url Upto plugin app dir.
		 *
		 * @var string
		 */
		private static $app_path;

		/**
		 * Init.
		 *
		 * @return void
		 * @return ( $plugin_path: http://domain-name/wp-content/plugins/wp-classified-react,) &
		 *
		 * ( $app_path : http://domain-name/wp-content/plugins/wp-classified-react/app)
		 */
		public static function inits() {
			self::$plugin_path = untrailingslashit( plugin_dir_url( WP_CLASSIFIED_ADS_PLUGIN_FILE ) );
			self::$app_path    = untrailingslashit( sprintf( '%s/%s', self::$plugin_path, 'app' ) );
		}

		/**
		 * Assets enqueue.
		 *
		 * @return script hadnler
		 */
		public static function register_scripts() {
			$script = array();
			// General Libraries.
			$scripts = array(
				'font-awesome-js'                 => array(
					'src'       => self::$app_path . '/bundle/js/font-awesome.min.css',
					'deps'      => array(),
					'ver'       => WP_CLASSIFIED_ADS_VERSION,
					'media'     => 'all',
					'in_footer' => true,
				),
				'wp-classified-ads-jquerys'       => array(
					'src'       => self::$app_path . '/dist/bundle/wp-classified-ads-frontend-jquery.js',
					'deps'      => array(),
					'ver'       => WP_CLASSIFIED_ADS_VERSION,
					'media'     => 'all',
					'in_footer' => true,
				),
			);

			$styles                                = array(
				'font-awesome-css'            => array(
					'src'   => self::$app_path . '/bundle/css/font-awesome.min.css',
					'deps'  => array(),
					'ver'   => WP_CLASSIFIED_ADS_VERSION,
					'media' => 'all',
				),
				'jquery-ui-css'               => array(
					'src'   => self::$app_path . '/bundle/css/jquery-ui.min.css',
					'deps'  => array(),
					'ver'   => WP_CLASSIFIED_ADS_VERSION,
					'media' => 'all',
				),
				'slick-slider-css'            => array(
					'src'   => self::$app_path . '/bundle/css/slick-slider.css',
					'deps'  => array(),
					'ver'   => WP_CLASSIFIED_ADS_VERSION,
					'media' => 'all',
				),
				'lightgallery-css'            => array(
					'src'   => self::$app_path . '/bundle/css/lightgallery.min.css',
					'deps'  => array(),
					'ver'   => WP_CLASSIFIED_ADS_VERSION,
					'media' => 'all',
				),
				'frontend-classified-ads-css' => array(
					'src'   => self::$app_path . '/dist/bundle/wp-classified-ads-frontend-jquery.css',
					'deps'  => array(),
					'ver'   => WP_CLASSIFIED_ADS_VERSION,
					'media' => 'all',
				),
				'react-datepicker-css'        => array(
					'src'   => self::$app_path . '/bundle/css/react-datepicker.css',
					'deps'  => array(),
					'ver'   => WP_CLASSIFIED_ADS_VERSION,
					'media' => 'all',
				),
			);
			$styles['wp-classified-ads']           = array(
				'src'   => self::$app_path . '/dist/bundle/wp-classified-ads.css',
				'deps'  => array( 'wp-components', 'font-awesome-css', 'jquery-ui-css', 'react-datepicker-css' ),
				'ver'   => WP_CLASSIFIED_ADS_VERSION,
				'media' => 'all',
			);
			$scripts['wp-classified-ads']          = array(
				'src'       => self::$app_path . '/dist/bundle/wp-classified-ads.js',
				'deps'      => array( 'jquery', 'wp-i18n', 'wp-dom-ready', 'wp-data', 'wp-element', 'wp-editor', 'font-awesome-js' ),
				'ver'       => WP_CLASSIFIED_ADS_VERSION,
				'in_footer' => true,
			);
			$styles['wp-classified-ads-frontend']  = array(
				'src'   => self::$app_path . '/dist/bundle/wp-classified-ads-frontend.css',
				'deps'  => array( 'wp-components', 'font-awesome-css', 'jquery-ui-css', 'frontend-classified-ads-css', 'slick-slider-css', 'lightgallery-css', 'react-datepicker-css' ),
				'ver'   => WP_CLASSIFIED_ADS_VERSION,
				'media' => 'all',
			);
			$scripts['wp-classified-ads-frontend'] = array(
				'src'       => self::$app_path . '/dist/bundle/wp-classified-ads-frontend.js',
				'deps'      => array( 'jquery', 'wp-i18n', 'wp-dom-ready', 'wp-data', 'wp-element', 'wp-editor' ),
				'ver'       => WP_CLASSIFIED_ADS_VERSION,
				'in_footer' => true,
			);

			// Register scripts and styles.
			$registered = array(
				'scripts' => $scripts,
				'styles'  => $styles,
			);

			$registered         = apply_filters( 'wpclassified_registered_scripts', $registered );
			$registered_styles  = isset( $registered['styles'] ) ? $registered['styles'] : array();
			$registered_scripts = isset( $registered['scripts'] ) ? $registered['scripts'] : array();

			// Registered Styles.
			foreach ( $registered_styles as $handler => $script ) {
				wp_register_style( $handler, $script['src'], $script['deps'], $script['ver'], $script['media'] );
			}

			// Registered Scripts.
			foreach ( $registered_scripts as $handler => $script ) {
				wp_register_script( $handler, $script['src'], $script['deps'], $script['ver'], $script['in_footer'] );
			}
		}

		/**
		 * What type of request is this?
		 *
		 * @param  string $type admin, ajax, cron or frontend.
		 * @return bool
		 */
		private static function is_request( $type ) {
			switch ( $type ) {
				case 'admin':
					return is_admin();
				case 'ajax':
					return defined( 'DOING_AJAX' );
				case 'cron':
					return defined( 'DOING_CRON' );
				case 'frontend':
					return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' );
			}
		}
	}
}
// $ne = new Frontend_Backend_Assets();
// $ne->init();
