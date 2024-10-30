<?php
/**
 * Create user for ads
 * name space declear
 */
namespace Wp_Classified_Ads;

/**
 * use WordPress class for api
 */
use WP_REST_Request;
/**
 * create class for signup api
 */

if ( ! class_exists( 'Wp_Classified_Ads_User_Create' ) ) {
	class Wp_Classified_Ads_User_Create {
		public static function wp_classified_ads_create_user( WP_REST_Request $wp_classified_user ) {
			header( 'Access-Control-Allow-Origin: *' );
			$profile_image = isset( $_FILES['file'] ) ? $_FILES['file'] : array();
			$user_data     = $wp_classified_user->get_params();
			$user_obj      = new WP_Classified_User_Helper();
			$user_data     = is_string( $user_data ) ? json_decode( $user_data, true ) : $user_data;
			$response      = $user_obj->classified_create_user( $user_data, $profile_image );
			return $response;
		}
	}
}
