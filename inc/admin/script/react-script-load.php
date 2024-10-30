<?php
/**
 * Admin Script define
 */

// Namespace define for Scripts
namespace Wp_Classified_Ads;

/**
 *
 * @package wp-classified-ads
 * @category classified-ads
 * @author WenSolution
 *
 * @since 1.0
 */
if ( ! class_exists( 'Classified_Ads_Script' ) ) {
	class Classified_Ads_Script {

		/**
		 * Load script from define
		 *
		 * Discriptionp : Use to load js( react, jquery ), css ( scss, css ) File
		 */
		public static function wp_classified_ads_admin_script() {
			wp_enqueue_editor();
			Frontend_Backend_Assets::register_scripts();
			$strings = Classified_Ads_Admin_String::get_string();
			// wp_register_script( 'wp-classified-ads', WP_CLASSIFIED_ADS_PLUGIN_URL . 'app/backend/dist/bundle/wp-classified-ads.js', array( 'jquery', 'wp-i18n', 'wp-dom-ready', 'wp-data', 'wp-element', 'wp-editor' ), wp_rand(), true );
			wp_enqueue_script( 'wp-classified-ads' );
			wp_enqueue_style( 'wp-classified-ads' );
			wp_enqueue_media();
			wp_localize_script( 'wp-classified-ads', 'ads_strings', $strings );
		}
		/**
		 * Load script from define in frontend
		 *
		 * Discriptionp : Use to load js( react, jquery ), css ( scss, css ) File
		 */
		public static function wp_classified_ads_frontend_script() {
			wp_enqueue_editor();
			Frontend_Backend_Assets::register_scripts();
			$strings = Classified_Ads_Admin_String::get_string();
			wp_enqueue_script( 'wp-classified-ads-frontend' );
			wp_enqueue_style( 'wp-classified-ads-frontend' );
			wp_enqueue_media();
			wp_localize_script( 'wp-classified-ads-frontend', 'ads_strings', $strings );
		}

	}
}
