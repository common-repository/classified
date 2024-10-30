<?php
/**
 * use for get active user
 * create namespace
 */
namespace Wp_Classified_Ads;

/**
 * Use WordPress json responce class
 */
use WP_REST_Request;
/**
 * check class exist or not
 */
if ( ! class_exists( 'Wp_Classified_Ads_User_Get' ) ) {
	/**
	 * declear class
	 */
	class Wp_Classified_Ads_User_Get {
		/**
		 * declear function of fetching active user
		 */
		public static function wp_classified_ads_get_user( WP_REST_Request $wp_classified_user ) {
			$user_request = $wp_classified_user->get_params();
			$user_obj     = new WP_Classified_User_Helper();
			$user_data    = $user_obj->wp_classified_active_user();
			return $user_data;
		}
	}
}
