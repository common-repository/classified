<?php
/**
 * use for login user
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
if ( ! class_exists( 'Wp_Classified_Ads_User_LoginUser' ) ) {
	/**
	 * declear class
	 */
	class Wp_Classified_Ads_User_LoginUser {
		/**
		 * declear function of logins
		 */
		public static function wp_classified_ads_login_user( WP_REST_Request $wp_classified_user ) {
			$user_request = $wp_classified_user->get_params();
			$user_obj     = new WP_Classified_User_Helper();
			$response     = $user_obj->classified_user_logins( $user_request );
			return $response;
		}
	}
}
