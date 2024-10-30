<?php
/**
 * use for logout user
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
if ( ! class_exists( 'Wp_Classified_Ads_User_LogOut' ) ) {
	/**
	 * declear class
	 */
	class Wp_Classified_Ads_User_LogOut {
		/**
		 * declear function of logins
		 */
		public static function wp_classified_ads_logout_user( WP_REST_Request $wp_classified_user ) {
			$user_request = $wp_classified_user->get_params();
			$user_ids     = isset( $_COOKIE['wp-classified-user'] ) ? $_COOKIE['wp-classified-user'] : 0;

			// $_COOKIE['wp-classified-user']
			setCookie( 'wp-classified-user-id', $user_ids, time() - 86800, '/' );
			return 'logout_success';
		}
	}
}
